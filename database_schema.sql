-- Mtaa Database Schema
-- PostgreSQL 14+
-- Run this script to create the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries

-- Enums
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE user_language AS ENUM ('en', 'sw');
CREATE TYPE post_category AS ENUM ('news', 'discussion', 'question', 'announcement', 'lost_found');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE alert_type AS ENUM ('crime', 'accident', 'fire', 'medical', 'other');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE listing_category AS ENUM ('electronics', 'furniture', 'vehicles', 'clothing', 'services', 'food', 'other');
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE event_type AS ENUM ('social', 'business', 'community', 'religious', 'sports', 'other');
CREATE TYPE conversation_type AS ENUM ('direct', 'group');
CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'file');
CREATE TYPE notification_type AS ENUM ('post_like', 'post_comment', 'safety_alert', 'message', 'marketplace', 'event', 'system');
CREATE TYPE report_type AS ENUM ('spam', 'harassment', 'inappropriate', 'fake', 'scam', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE otp_purpose AS ENUM ('login', 'registration', 'password_reset', 'phone_verification');
CREATE TYPE device_type AS ENUM ('ios', 'android', 'web');
CREATE TYPE rsvp_status AS ENUM ('going', 'maybe', 'not_going');

-- Neighborhoods
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    county VARCHAR(255) NOT NULL,
    boundary_coordinates JSONB NOT NULL, -- GeoJSON polygon
    center_latitude DECIMAL(10, 8),
    center_longitude DECIMAL(11, 8),
    admin_user_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_neighborhoods_city ON neighborhoods(city);
CREATE INDEX idx_neighborhoods_county ON neighborhoods(county);
CREATE INDEX idx_neighborhoods_active ON neighborhoods(is_active);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_image_url VARCHAR(500),
    bio TEXT,
    neighborhood_id UUID REFERENCES neighborhoods(id),
    address VARCHAR(500),
    location_verified BOOLEAN DEFAULT false,
    verification_status verification_status DEFAULT 'pending',
    language_preference user_language DEFAULT 'en',
    mpesa_number VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    ban_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_neighborhood ON users(neighborhood_id);
CREATE INDEX idx_users_active ON users(is_active);

-- Add foreign key for neighborhoods admin
ALTER TABLE neighborhoods ADD CONSTRAINT fk_neighborhoods_admin 
    FOREIGN KEY (admin_user_id) REFERENCES users(id);

-- Posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
    category post_category NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    media_urls JSONB, -- Array of image/video URLs
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    is_anonymous BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    moderation_status moderation_status DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_neighborhood ON posts(neighborhood_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_moderation ON posts(moderation_status);
CREATE INDEX idx_posts_deleted ON posts(deleted_at) WHERE deleted_at IS NULL;

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    moderation_status moderation_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- Safety Alerts
CREATE TABLE safety_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
    alert_type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500),
    media_urls JSONB,
    is_verified BOOLEAN DEFAULT false,
    verified_by_user_id UUID REFERENCES users(id),
    verification_count INTEGER DEFAULT 0,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_safety_alerts_neighborhood ON safety_alerts(neighborhood_id);
CREATE INDEX idx_safety_alerts_type ON safety_alerts(alert_type);
CREATE INDEX idx_safety_alerts_severity ON safety_alerts(severity);
CREATE INDEX idx_safety_alerts_created ON safety_alerts(created_at DESC);
CREATE INDEX idx_safety_alerts_resolved ON safety_alerts(is_resolved);

-- Marketplace Listings
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
    category listing_category NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    condition listing_condition NOT NULL,
    image_urls JSONB NOT NULL, -- Array of image URLs
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    is_negotiable BOOLEAN DEFAULT false,
    is_sold BOOLEAN DEFAULT false,
    sold_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    moderation_status moderation_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listings_user ON marketplace_listings(user_id);
CREATE INDEX idx_listings_neighborhood ON marketplace_listings(neighborhood_id);
CREATE INDEX idx_listings_category ON marketplace_listings(category);
CREATE INDEX idx_listings_price ON marketplace_listings(price);
CREATE INDEX idx_listings_sold ON marketplace_listings(is_sold);
CREATE INDEX idx_listings_created ON marketplace_listings(created_at DESC);

-- Marketplace Transactions
CREATE TABLE marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    mpesa_transaction_id VARCHAR(100) UNIQUE,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_listing ON marketplace_transactions(listing_id);
CREATE INDEX idx_transactions_buyer ON marketplace_transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON marketplace_transactions(seller_id);
CREATE INDEX idx_transactions_status ON marketplace_transactions(status);
CREATE INDEX idx_transactions_mpesa ON marketplace_transactions(mpesa_transaction_id);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    event_type event_type NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP,
    location_name VARCHAR(255) NOT NULL,
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500),
    image_url VARCHAR(500),
    is_free BOOLEAN DEFAULT true,
    ticket_price DECIMAL(12, 2),
    max_attendees INTEGER,
    rsvp_count INTEGER DEFAULT 0,
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_neighborhood ON events(neighborhood_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_start ON events(start_datetime);
CREATE INDEX idx_events_cancelled ON events(is_cancelled);

-- Event RSVPs
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status rsvp_status NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_rsvps_user ON event_rsvps(user_id);
CREATE INDEX idx_rsvps_status ON event_rsvps(status);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type conversation_type NOT NULL,
    name VARCHAR(255), -- For group chats
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversations_creator ON conversations(created_by_user_id);

-- Conversation Participants
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_message_id UUID,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    message_type message_type DEFAULT 'text',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_read ON messages(is_read);

-- Add foreign key for last_read_message_id
ALTER TABLE conversation_participants ADD CONSTRAINT fk_participants_last_read 
    FOREIGN KEY (last_read_message_id) REFERENCES messages(id);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- User Reports
CREATE TABLE user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by_user_id UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    reported_post_id UUID REFERENCES posts(id),
    reported_comment_id UUID REFERENCES comments(id),
    reported_listing_id UUID REFERENCES marketplace_listings(id),
    report_type report_type NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    reviewed_by_user_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_reporter ON user_reports(reported_by_user_id);
CREATE INDEX idx_reports_reported_user ON user_reports(reported_user_id);
CREATE INDEX idx_reports_post ON user_reports(reported_post_id);
CREATE INDEX idx_reports_status ON user_reports(status);
CREATE INDEX idx_reports_created ON user_reports(created_at DESC);

-- User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_type device_type NOT NULL,
    fcm_token VARCHAR(500),
    ip_address VARCHAR(45),
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_device ON user_sessions(device_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- OTP Codes
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose otp_purpose NOT NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_phone ON otp_codes(phone_number);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);
CREATE INDEX idx_otp_used ON otp_codes(is_used);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_alerts_updated_at BEFORE UPDATE ON safety_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON marketplace_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functions for updating counts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_count AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
        UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'going' AND NEW.status != 'going' THEN
            UPDATE events SET rsvp_count = rsvp_count - 1 WHERE id = NEW.event_id;
        ELSIF OLD.status != 'going' AND NEW.status = 'going' THEN
            UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = NEW.event_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
        UPDATE events SET rsvp_count = rsvp_count - 1 WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rsvp_count AFTER INSERT OR UPDATE OR DELETE ON event_rsvps
    FOR EACH ROW EXECUTE FUNCTION update_event_rsvp_count();



