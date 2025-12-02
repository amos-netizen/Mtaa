# Mtaa - Technical Specification
## Hyperlocal Kenyan Neighborhood Social Network

---

## 1. High-Level Summary

**Mtaa** is a mobile-first, hyperlocal social network connecting Kenyan neighborhoods. The platform enables residents to share local news, safety alerts, marketplace items, events, and community discussions within verified geographic boundaries. Built with security, scalability, and Kenyan localization at its core, Mtaa uses location verification, SMS authentication, M-Pesa integration, and Swahili/English support to serve diverse urban and peri-urban communities.

**Core Value Proposition:**
- Real-time neighborhood safety alerts and crime reporting
- Local marketplace for buying/selling within the community
- Community events and meetups
- Neighborhood discussions and news
- Verified resident network with location-based access control

---

## 2. Architecture Overview

### Architecture Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  iOS App (Swift/SwiftUI)  │  Android App (Kotlin/Jetpack)      │
│  React Native (Optional)   │  Web Admin Dashboard (React)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST + WebSocket
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Kong/AWS API Gateway │ Rate Limiting │ Auth Middleware         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service    │  Posts Service    │  Safety Service          │
│  Messaging       │  Marketplace      │  Events Service          │
│  Notifications   │  Moderation       │  Location Service        │
│  Analytics       │  Admin Service    │  Media Service           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)  │  Redis (Cache/Sessions)                │
│  MongoDB (Analytics)    │  S3/MinIO (Media Storage)              │
│  Elasticsearch (Search) │  TimescaleDB (Time-series data)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                          │
├─────────────────────────────────────────────────────────────────┤
│  Safaricom SMS API  │  M-Pesa API  │  Google Maps API           │
│  Firebase Cloud Messaging │  Twilio (Backup SMS)                 │
│  AWS S3/CloudFront  │  Sentry (Error Tracking)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Microservices

#### **Auth Service**
- User registration/authentication
- SMS OTP verification
- JWT token management
- Session management
- Password reset via SMS
- Account verification

#### **Posts Service**
- Create/read/update/delete posts
- Post categories (News, Discussion, Question, etc.)
- Post reactions (Like, Helpful, Report)
- Comments and nested replies
- Post moderation queue
- Trending algorithm

#### **Safety Service**
- Safety alert creation
- Emergency reporting
- Crime incident tracking
- Safety tips and resources
- Alert verification workflow
- Police contact integration

#### **Messaging Service**
- Direct messages between users
- Group chats (neighborhood groups)
- Message encryption
- Read receipts
- Typing indicators
- Media sharing in messages

#### **Marketplace Service**
- Product/service listings
- Category management
- Search and filters
- M-Pesa payment integration
- Transaction history
- Seller ratings and reviews

#### **Events Service**
- Event creation and management
- RSVP functionality
- Event discovery
- Calendar integration
- Event reminders

#### **Notifications Service**
- Push notifications (FCM)
- SMS notifications (critical alerts)
- In-app notifications
- Notification preferences
- Notification history

#### **Moderation Service**
- Content moderation (AI + human)
- User reporting system
- Automated flagging
- Moderation queue management
- Ban/suspension management
- Appeal process

#### **Location Service**
- Neighborhood boundary management
- Location verification
- Geofencing
- Address validation
- Location-based content filtering

#### **Analytics Service**
- User engagement metrics
- Content performance
- Safety incident analytics
- Marketplace transaction analytics
- Admin dashboards

#### **Admin Service**
- User management
- Content management
- System configuration
- Neighborhood management
- Reports and insights

#### **Media Service**
- Image/video upload
- Media processing and optimization
- CDN integration
- Thumbnail generation
- Media moderation

### Frontend Apps

#### **iOS App (Native Swift/SwiftUI)**
- Minimum iOS 14+
- Dark mode support
- Swahili/English localization
- Offline-first architecture
- Push notifications

#### **Android App (Native Kotlin/Jetpack Compose)**
- Minimum Android 8.0 (API 26)
- Material Design 3
- Swahili/English localization
- Offline-first architecture
- Push notifications

#### **Web Admin Dashboard (React/TypeScript)**
- Content moderation interface
- User management
- Analytics dashboards
- System configuration
- Neighborhood management

### APIs

**Protocol:** RESTful API + WebSocket (real-time features)
**Authentication:** JWT Bearer tokens
**API Versioning:** `/api/v1/`
**Response Format:** JSON
**Error Handling:** Standardized error responses

### Databases

#### **PostgreSQL (Primary)**
- User data
- Posts and comments
- Marketplace listings
- Events
- Safety alerts
- Messages
- Transactions

#### **Redis**
- Session storage
- Rate limiting counters
- Real-time data caching
- OTP storage (TTL)
- Trending posts cache

#### **MongoDB**
- Analytics events
- Logs
- User activity streams
- Search indexes

#### **Elasticsearch**
- Full-text search (posts, marketplace, users)
- Advanced filtering
- Autocomplete suggestions

#### **TimescaleDB**
- Time-series data (safety incidents, analytics)
- Historical trends

#### **S3/MinIO**
- User profile images
- Post media (images/videos)
- Marketplace product images
- Document storage

### Integrations

#### **SMS (Safaricom/Twilio)**
- OTP delivery
- Critical safety alerts
- Transaction confirmations
- Account security notifications

#### **M-Pesa API**
- Payment processing
- Marketplace transactions
- Event ticket sales
- Donations

#### **Google Maps API**
- Location verification
- Neighborhood boundaries
- Address geocoding
- Map visualization

#### **Firebase Cloud Messaging**
- Push notifications (iOS/Android)
- Real-time message delivery

#### **AWS S3/CloudFront**
- Media storage and CDN
- Global content delivery

---

## 3. Database Schema

### Core Tables

#### **users**
```sql
- id (UUID, PK)
- phone_number (VARCHAR, UNIQUE, NOT NULL)
- email (VARCHAR, UNIQUE, NULLABLE)
- full_name (VARCHAR, NOT NULL)
- username (VARCHAR, UNIQUE, NOT NULL)
- profile_image_url (VARCHAR, NULLABLE)
- bio (TEXT, NULLABLE)
- neighborhood_id (UUID, FK → neighborhoods.id)
- address (VARCHAR, NULLABLE)
- location_verified (BOOLEAN, DEFAULT false)
- verification_status (ENUM: pending, verified, rejected)
- language_preference (ENUM: en, sw)
- mpesa_number (VARCHAR, NULLABLE)
- is_active (BOOLEAN, DEFAULT true)
- is_banned (BOOLEAN, DEFAULT false)
- ban_reason (TEXT, NULLABLE)
- ban_expires_at (TIMESTAMP, NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_seen_at (TIMESTAMP)
```

#### **neighborhoods**
```sql
- id (UUID, PK)
- name (VARCHAR, NOT NULL)
- city (VARCHAR, NOT NULL)
- county (VARCHAR, NOT NULL)
- boundary_coordinates (JSONB, NOT NULL) -- GeoJSON polygon
- center_latitude (DECIMAL)
- center_longitude (DECIMAL)
- admin_user_id (UUID, FK → users.id)
- is_active (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **posts**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- neighborhood_id (UUID, FK → neighborhoods.id, NOT NULL)
- category (ENUM: news, discussion, question, announcement, lost_found)
- title (VARCHAR, NOT NULL)
- content (TEXT, NOT NULL)
- media_urls (JSONB, NULLABLE) -- Array of image/video URLs
- location_latitude (DECIMAL, NULLABLE)
- location_longitude (DECIMAL, NULLABLE)
- is_anonymous (BOOLEAN, DEFAULT false)
- is_pinned (BOOLEAN, DEFAULT false)
- is_verified (BOOLEAN, DEFAULT false)
- moderation_status (ENUM: pending, approved, rejected, flagged)
- view_count (INTEGER, DEFAULT 0)
- like_count (INTEGER, DEFAULT 0)
- comment_count (INTEGER, DEFAULT 0)
- report_count (INTEGER, DEFAULT 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP, NULLABLE)
```

#### **comments**
```sql
- id (UUID, PK)
- post_id (UUID, FK → posts.id, NOT NULL)
- user_id (UUID, FK → users.id, NOT NULL)
- parent_comment_id (UUID, FK → comments.id, NULLABLE) -- For nested replies
- content (TEXT, NOT NULL)
- like_count (INTEGER, DEFAULT 0)
- report_count (INTEGER, DEFAULT 0)
- moderation_status (ENUM: pending, approved, rejected, flagged)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP, NULLABLE)
```

#### **safety_alerts**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- neighborhood_id (UUID, FK → neighborhoods.id, NOT NULL)
- alert_type (ENUM: crime, accident, fire, medical, other)
- severity (ENUM: low, medium, high, critical)
- title (VARCHAR, NOT NULL)
- description (TEXT, NOT NULL)
- location_latitude (DECIMAL, NOT NULL)
- location_longitude (DECIMAL, NOT NULL)
- address (VARCHAR, NULLABLE)
- media_urls (JSONB, NULLABLE)
- is_verified (BOOLEAN, DEFAULT false)
- verified_by_user_id (UUID, FK → users.id, NULLABLE)
- verification_count (INTEGER, DEFAULT 0)
- is_resolved (BOOLEAN, DEFAULT false)
- resolved_at (TIMESTAMP, NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **marketplace_listings**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- neighborhood_id (UUID, FK → neighborhoods.id, NOT NULL)
- category (ENUM: electronics, furniture, vehicles, clothing, services, food, other)
- title (VARCHAR, NOT NULL)
- description (TEXT, NOT NULL)
- price (DECIMAL, NOT NULL)
- currency (VARCHAR, DEFAULT 'KES')
- condition (ENUM: new, like_new, good, fair, poor)
- image_urls (JSONB, NOT NULL) -- Array of image URLs
- location_latitude (DECIMAL, NULLABLE)
- location_longitude (DECIMAL, NULLABLE)
- is_negotiable (BOOLEAN, DEFAULT false)
- is_sold (BOOLEAN, DEFAULT false)
- sold_at (TIMESTAMP, NULLABLE)
- view_count (INTEGER, DEFAULT 0)
- contact_count (INTEGER, DEFAULT 0)
- moderation_status (ENUM: pending, approved, rejected, flagged)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **marketplace_transactions**
```sql
- id (UUID, PK)
- listing_id (UUID, FK → marketplace_listings.id, NOT NULL)
- buyer_id (UUID, FK → users.id, NOT NULL)
- seller_id (UUID, FK → users.id, NOT NULL)
- amount (DECIMAL, NOT NULL)
- currency (VARCHAR, DEFAULT 'KES')
- mpesa_transaction_id (VARCHAR, UNIQUE, NULLABLE)
- status (ENUM: pending, completed, cancelled, refunded)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **events**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- neighborhood_id (UUID, FK → neighborhoods.id, NOT NULL)
- title (VARCHAR, NOT NULL)
- description (TEXT, NOT NULL)
- event_type (ENUM: social, business, community, religious, sports, other)
- start_datetime (TIMESTAMP, NOT NULL)
- end_datetime (TIMESTAMP, NULLABLE)
- location_name (VARCHAR, NOT NULL)
- location_latitude (DECIMAL, NOT NULL)
- location_longitude (DECIMAL, NOT NULL)
- address (VARCHAR, NULLABLE)
- image_url (VARCHAR, NULLABLE)
- is_free (BOOLEAN, DEFAULT true)
- ticket_price (DECIMAL, NULLABLE)
- max_attendees (INTEGER, NULLABLE)
- rsvp_count (INTEGER, DEFAULT 0)
- is_cancelled (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **event_rsvps**
```sql
- id (UUID, PK)
- event_id (UUID, FK → events.id, NOT NULL)
- user_id (UUID, FK → users.id, NOT NULL)
- status (ENUM: going, maybe, not_going)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(event_id, user_id)
```

#### **messages**
```sql
- id (UUID, PK)
- conversation_id (UUID, FK → conversations.id, NOT NULL)
- sender_id (UUID, FK → users.id, NOT NULL)
- content (TEXT, NOT NULL)
- media_url (VARCHAR, NULLABLE)
- message_type (ENUM: text, image, video, file)
- is_read (BOOLEAN, DEFAULT false)
- read_at (TIMESTAMP, NULLABLE)
- created_at (TIMESTAMP)
```

#### **conversations**
```sql
- id (UUID, PK)
- type (ENUM: direct, group)
- name (VARCHAR, NULLABLE) -- For group chats
- created_by_user_id (UUID, FK → users.id, NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **conversation_participants**
```sql
- id (UUID, PK)
- conversation_id (UUID, FK → conversations.id, NOT NULL)
- user_id (UUID, FK → users.id, NOT NULL)
- last_read_message_id (UUID, FK → messages.id, NULLABLE)
- joined_at (TIMESTAMP)
- left_at (TIMESTAMP, NULLABLE)
- UNIQUE(conversation_id, user_id)
```

#### **notifications**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- type (ENUM: post_like, post_comment, safety_alert, message, marketplace, event, system)
- title (VARCHAR, NOT NULL)
- body (TEXT, NOT NULL)
- data (JSONB, NULLABLE) -- Additional notification data
- is_read (BOOLEAN, DEFAULT false)
- read_at (TIMESTAMP, NULLABLE)
- created_at (TIMESTAMP)
```

#### **user_reports**
```sql
- id (UUID, PK)
- reported_by_user_id (UUID, FK → users.id, NOT NULL)
- reported_user_id (UUID, FK → users.id, NULLABLE)
- reported_post_id (UUID, FK → posts.id, NULLABLE)
- reported_comment_id (UUID, FK → comments.id, NULLABLE)
- reported_listing_id (UUID, FK → marketplace_listings.id, NULLABLE)
- report_type (ENUM: spam, harassment, inappropriate, fake, scam, other)
- reason (TEXT, NOT NULL)
- status (ENUM: pending, reviewed, resolved, dismissed)
- reviewed_by_user_id (UUID, FK → users.id, NULLABLE)
- reviewed_at (TIMESTAMP, NULLABLE)
- created_at (TIMESTAMP)
```

#### **user_sessions**
```sql
- id (UUID, PK)
- user_id (UUID, FK → users.id, NOT NULL)
- device_id (VARCHAR, NOT NULL)
- device_type (ENUM: ios, android, web)
- fcm_token (VARCHAR, NULLABLE)
- ip_address (VARCHAR, NULLABLE)
- last_activity_at (TIMESTAMP)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### **otp_codes**
```sql
- id (UUID, PK)
- phone_number (VARCHAR, NOT NULL)
- code (VARCHAR(6), NOT NULL)
- purpose (ENUM: login, registration, password_reset, phone_verification)
- is_used (BOOLEAN, DEFAULT false)
- expires_at (TIMESTAMP, NOT NULL)
- created_at (TIMESTAMP)
```

### Relationships Summary

- **users** → **neighborhoods** (Many-to-One)
- **users** → **posts** (One-to-Many)
- **posts** → **comments** (One-to-Many)
- **comments** → **comments** (Self-referential for nested replies)
- **users** → **safety_alerts** (One-to-Many)
- **users** → **marketplace_listings** (One-to-Many)
- **marketplace_listings** → **marketplace_transactions** (One-to-Many)
- **users** → **events** (One-to-Many)
- **events** → **event_rsvps** (One-to-Many)
- **conversations** → **messages** (One-to-Many)
- **conversations** → **conversation_participants** (One-to-Many, Many-to-Many)
- **users** → **notifications** (One-to-Many)
- **users** → **user_reports** (One-to-Many, as reporter and reported)

---

## 4. API Endpoints

### Authentication Service

#### **POST /api/v1/auth/register**
- Request: `{ phone_number, full_name, username, neighborhood_id, address }`
- Response: `{ user_id, message: "OTP sent" }`
- Description: Register new user, sends OTP via SMS

#### **POST /api/v1/auth/verify-otp**
- Request: `{ phone_number, otp_code }`
- Response: `{ access_token, refresh_token, user }`
- Description: Verify OTP and return JWT tokens

#### **POST /api/v1/auth/login**
- Request: `{ phone_number }`
- Response: `{ message: "OTP sent" }`
- Description: Request login OTP

#### **POST /api/v1/auth/refresh-token**
- Request: `{ refresh_token }`
- Response: `{ access_token, refresh_token }`
- Description: Refresh access token

#### **POST /api/v1/auth/logout**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Logged out" }`
- Description: Invalidate session

#### **POST /api/v1/auth/reset-password**
- Request: `{ phone_number }`
- Response: `{ message: "OTP sent" }`
- Description: Request password reset OTP

#### **POST /api/v1/auth/verify-reset-otp**
- Request: `{ phone_number, otp_code, new_password }`
- Response: `{ message: "Password reset successful" }`
- Description: Verify reset OTP and update password

#### **GET /api/v1/auth/me**
- Headers: `Authorization: Bearer <token>`
- Response: `{ user }`
- Description: Get current user profile

#### **PUT /api/v1/auth/me**
- Headers: `Authorization: Bearer <token>`
- Request: `{ full_name, bio, profile_image_url, language_preference, mpesa_number }`
- Response: `{ user }`
- Description: Update user profile

### Posts Service

#### **GET /api/v1/posts**
- Query Params: `neighborhood_id, category, page, limit, sort`
- Response: `{ posts[], pagination }`
- Description: Get posts for neighborhood

#### **GET /api/v1/posts/:id**
- Response: `{ post, comments[] }`
- Description: Get single post with comments

#### **POST /api/v1/posts**
- Headers: `Authorization: Bearer <token>`
- Request: `{ neighborhood_id, category, title, content, media_urls[], location_latitude, location_longitude, is_anonymous }`
- Response: `{ post }`
- Description: Create new post

#### **PUT /api/v1/posts/:id**
- Headers: `Authorization: Bearer <token>`
- Request: `{ title, content, media_urls[] }`
- Response: `{ post }`
- Description: Update post (owner only)

#### **DELETE /api/v1/posts/:id**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Post deleted" }`
- Description: Delete post (owner only)

#### **POST /api/v1/posts/:id/like**
- Headers: `Authorization: Bearer <token>`
- Response: `{ liked: true, like_count }`
- Description: Toggle like on post

#### **POST /api/v1/posts/:id/report**
- Headers: `Authorization: Bearer <token>`
- Request: `{ report_type, reason }`
- Response: `{ message: "Report submitted" }`
- Description: Report inappropriate post

### Comments Service

#### **GET /api/v1/posts/:post_id/comments**
- Query Params: `page, limit`
- Response: `{ comments[], pagination }`
- Description: Get comments for post

#### **POST /api/v1/posts/:post_id/comments**
- Headers: `Authorization: Bearer <token>`
- Request: `{ content, parent_comment_id }`
- Response: `{ comment }`
- Description: Create comment (or reply)

#### **PUT /api/v1/comments/:id**
- Headers: `Authorization: Bearer <token>`
- Request: `{ content }`
- Response: `{ comment }`
- Description: Update comment (owner only)

#### **DELETE /api/v1/comments/:id**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Comment deleted" }`
- Description: Delete comment (owner only)

#### **POST /api/v1/comments/:id/like**
- Headers: `Authorization: Bearer <token>`
- Response: `{ liked: true, like_count }`
- Description: Toggle like on comment

### Safety Alerts Service

#### **GET /api/v1/safety-alerts**
- Query Params: `neighborhood_id, alert_type, severity, page, limit`
- Response: `{ alerts[], pagination }`
- Description: Get safety alerts for neighborhood

#### **GET /api/v1/safety-alerts/:id**
- Response: `{ alert }`
- Description: Get single safety alert

#### **POST /api/v1/safety-alerts**
- Headers: `Authorization: Bearer <token>`
- Request: `{ neighborhood_id, alert_type, severity, title, description, location_latitude, location_longitude, address, media_urls[] }`
- Response: `{ alert }`
- Description: Create safety alert

#### **POST /api/v1/safety-alerts/:id/verify**
- Headers: `Authorization: Bearer <token>`
- Response: `{ alert, verification_count }`
- Description: Verify safety alert (increases verification count)

#### **PUT /api/v1/safety-alerts/:id/resolve**
- Headers: `Authorization: Bearer <token>`
- Response: `{ alert }`
- Description: Mark alert as resolved

#### **POST /api/v1/safety-alerts/:id/report**
- Headers: `Authorization: Bearer <token>`
- Request: `{ report_type, reason }`
- Response: `{ message: "Report submitted" }`
- Description: Report false/misleading alert

### Marketplace Service

#### **GET /api/v1/marketplace/listings**
- Query Params: `neighborhood_id, category, min_price, max_price, condition, page, limit, search`
- Response: `{ listings[], pagination }`
- Description: Get marketplace listings

#### **GET /api/v1/marketplace/listings/:id**
- Response: `{ listing }`
- Description: Get single listing

#### **POST /api/v1/marketplace/listings**
- Headers: `Authorization: Bearer <token>`
- Request: `{ neighborhood_id, category, title, description, price, condition, image_urls[], location_latitude, location_longitude, is_negotiable }`
- Response: `{ listing }`
- Description: Create marketplace listing

#### **PUT /api/v1/marketplace/listings/:id**
- Headers: `Authorization: Bearer <token>`
- Request: `{ title, description, price, condition, image_urls[], is_negotiable }`
- Response: `{ listing }`
- Description: Update listing (owner only)

#### **DELETE /api/v1/marketplace/listings/:id**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Listing deleted" }`
- Description: Delete listing (owner only)

#### **POST /api/v1/marketplace/listings/:id/mark-sold**
- Headers: `Authorization: Bearer <token>`
- Response: `{ listing }`
- Description: Mark listing as sold

#### **POST /api/v1/marketplace/listings/:id/contact**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Contact info sent" }`
- Description: Request seller contact info (increments contact_count)

#### **POST /api/v1/marketplace/transactions**
- Headers: `Authorization: Bearer <token>`
- Request: `{ listing_id, amount }`
- Response: `{ transaction, mpesa_payment_request }`
- Description: Initiate M-Pesa payment for listing

#### **POST /api/v1/marketplace/transactions/:id/confirm**
- Headers: `Authorization: Bearer <token>`
- Request: `{ mpesa_transaction_id }`
- Response: `{ transaction }`
- Description: Confirm M-Pesa transaction completion

### Events Service

#### **GET /api/v1/events**
- Query Params: `neighborhood_id, event_type, start_date, end_date, page, limit`
- Response: `{ events[], pagination }`
- Description: Get events for neighborhood

#### **GET /api/v1/events/:id**
- Response: `{ event, rsvps[] }`
- Description: Get single event with RSVPs

#### **POST /api/v1/events**
- Headers: `Authorization: Bearer <token>`
- Request: `{ neighborhood_id, title, description, event_type, start_datetime, end_datetime, location_name, location_latitude, location_longitude, address, image_url, is_free, ticket_price, max_attendees }`
- Response: `{ event }`
- Description: Create event

#### **PUT /api/v1/events/:id**
- Headers: `Authorization: Bearer <token>`
- Request: `{ title, description, start_datetime, end_datetime, location_name, location_latitude, location_longitude, address, image_url, is_free, ticket_price, max_attendees }`
- Response: `{ event }`
- Description: Update event (owner only)

#### **DELETE /api/v1/events/:id**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "Event deleted" }`
- Description: Delete event (owner only)

#### **POST /api/v1/events/:id/rsvp**
- Headers: `Authorization: Bearer <token>`
- Request: `{ status }` // going, maybe, not_going
- Response: `{ rsvp, event }`
- Description: RSVP to event

#### **PUT /api/v1/events/:id/cancel**
- Headers: `Authorization: Bearer <token>`
- Response: `{ event }`
- Description: Cancel event (owner only)

### Messaging Service

#### **GET /api/v1/conversations**
- Headers: `Authorization: Bearer <token>`
- Response: `{ conversations[] }`
- Description: Get user's conversations

#### **GET /api/v1/conversations/:id**
- Headers: `Authorization: Bearer <token>`
- Response: `{ conversation, participants[], messages[] }`
- Description: Get conversation with messages

#### **POST /api/v1/conversations**
- Headers: `Authorization: Bearer <token>`
- Request: `{ type, participant_user_ids[], name }` // For group chats
- Response: `{ conversation }`
- Description: Create conversation (direct or group)

#### **GET /api/v1/conversations/:id/messages**
- Headers: `Authorization: Bearer <token>`
- Query Params: `page, limit, before_message_id`
- Response: `{ messages[], pagination }`
- Description: Get messages for conversation

#### **POST /api/v1/conversations/:id/messages**
- Headers: `Authorization: Bearer <token>`
- Request: `{ content, media_url, message_type }`
- Response: `{ message }`
- Description: Send message

#### **PUT /api/v1/messages/:id/read**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message }`
- Description: Mark message as read

### Notifications Service

#### **GET /api/v1/notifications**
- Headers: `Authorization: Bearer <token>`
- Query Params: `page, limit, unread_only`
- Response: `{ notifications[], pagination }`
- Description: Get user notifications

#### **PUT /api/v1/notifications/:id/read**
- Headers: `Authorization: Bearer <token>`
- Response: `{ notification }`
- Description: Mark notification as read

#### **PUT /api/v1/notifications/read-all**
- Headers: `Authorization: Bearer <token>`
- Response: `{ message: "All notifications marked as read" }`
- Description: Mark all notifications as read

#### **GET /api/v1/notifications/preferences**
- Headers: `Authorization: Bearer <token>`
- Response: `{ preferences }`
- Description: Get notification preferences

#### **PUT /api/v1/notifications/preferences**
- Headers: `Authorization: Bearer <token>`
- Request: `{ push_enabled, sms_enabled, email_enabled, notification_types }`
- Response: `{ preferences }`
- Description: Update notification preferences

### Location Service

#### **GET /api/v1/neighborhoods**
- Query Params: `city, county, search`
- Response: `{ neighborhoods[] }`
- Description: Get neighborhoods (for registration/selection)

#### **GET /api/v1/neighborhoods/:id**
- Response: `{ neighborhood }`
- Description: Get neighborhood details

#### **POST /api/v1/location/verify**
- Headers: `Authorization: Bearer <token>`
- Request: `{ latitude, longitude, address }`
- Response: `{ verified: true, neighborhood_id }`
- Description: Verify user location within neighborhood

### Moderation Service (Admin)

#### **GET /api/v1/admin/moderation-queue**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Query Params: `type, status, page, limit`
- Response: `{ items[], pagination }`
- Description: Get moderation queue

#### **PUT /api/v1/admin/moderation-queue/:id/approve**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `{ item }`
- Description: Approve flagged content

#### **PUT /api/v1/admin/moderation-queue/:id/reject**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ reason }`
- Response: `{ item }`
- Description: Reject flagged content

#### **GET /api/v1/admin/reports**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Query Params: `status, page, limit`
- Response: `{ reports[], pagination }`
- Description: Get user reports

#### **PUT /api/v1/admin/reports/:id/resolve**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ action, reason }` // action: warn, ban, dismiss
- Response: `{ report }`
- Description: Resolve user report

#### **POST /api/v1/admin/users/:id/ban**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Request: `{ reason, duration_days }`
- Response: `{ user }`
- Description: Ban user

#### **POST /api/v1/admin/users/:id/unban**
- Headers: `Authorization: Bearer <token>` (Admin only)
- Response: `{ user }`
- Description: Unban user

### Search Service

#### **GET /api/v1/search**
- Query Params: `q, type, neighborhood_id, page, limit`
- Response: `{ results[], pagination }`
- Description: Global search (posts, marketplace, users, events)

---

## 5. Mobile App Structure

### iOS App (Swift/SwiftUI)

#### **Navigation Structure**
- **Tab Bar Navigation** (Main)
  - Home (Posts Feed)
  - Safety
  - Marketplace
  - Events
  - Profile

#### **Screens & Flows**

##### **Onboarding Flow**
1. **Welcome Screen**
   - App logo, tagline
   - "Get Started" button

2. **Phone Number Entry**
   - Phone input field (Kenyan format: +254...)
   - Country code selector
   - "Continue" button

3. **OTP Verification**
   - 6-digit OTP input
   - Auto-read SMS (if available)
   - Resend OTP button
   - Timer countdown

4. **Neighborhood Selection**
   - Search neighborhoods
   - Map view with boundaries
   - Select neighborhood

5. **Location Verification**
   - Request location permission
   - Verify address
   - Confirm location

6. **Profile Setup**
   - Full name
   - Username (unique)
   - Profile photo (optional)
   - Bio (optional)
   - Language preference (English/Swahili)

##### **Home Tab (Posts Feed)**
1. **Posts Feed Screen**
   - Pull-to-refresh
   - Infinite scroll
   - Post cards:
     - Author info (name, avatar, neighborhood)
     - Post category badge
     - Title and content
     - Media gallery (images/videos)
     - Like/comment counts
     - Timestamp
     - Action buttons (Like, Comment, Share, Report)
   - Filter by category
   - Sort options (Newest, Trending, Most Liked)

2. **Post Detail Screen**
   - Full post content
   - Comments section (nested replies)
   - Comment input at bottom
   - Like/share/report actions

3. **Create Post Screen**
   - Category selector
   - Title input
   - Content textarea
   - Media picker (camera/gallery)
   - Location picker (optional)
   - Anonymous toggle
   - Publish button

##### **Safety Tab**
1. **Safety Alerts Feed**
   - Alert cards with severity indicators
   - Map view toggle
   - Filter by type/severity
   - Create alert button (FAB)

2. **Alert Detail Screen**
   - Full alert details
   - Map with location pin
   - Verification button
   - Report false alert
   - Comments/discussion

3. **Create Safety Alert Screen**
   - Alert type selector
   - Severity selector
   - Title and description
   - Location picker (required)
   - Media upload (optional)
   - Submit button

##### **Marketplace Tab**
1. **Marketplace Feed**
   - Listing cards with images
   - Price, condition, location
   - Search bar
   - Filter by category/price
   - Create listing button (FAB)

2. **Listing Detail Screen**
   - Image gallery
   - Title, description, price
   - Seller info
   - Condition, location
   - Contact seller button
   - Buy now button (M-Pesa)
   - Report listing

3. **Create Listing Screen**
   - Category selector
   - Title and description
   - Price input
   - Condition selector
   - Image upload (multiple)
   - Location (optional)
   - Negotiable toggle
   - Publish button

4. **Transaction Screen**
   - Listing details
   - Amount summary
   - M-Pesa payment flow
   - Transaction status

##### **Events Tab**
1. **Events Feed**
   - Event cards with image, date, location
   - Calendar view toggle
   - Filter by type/date
   - Create event button (FAB)

2. **Event Detail Screen**
   - Full event details
   - Map with location
   - RSVP buttons (Going, Maybe, Not Going)
   - Attendee list
   - Share event

3. **Create Event Screen**
   - Title and description
   - Event type selector
   - Date/time picker
   - Location picker
   - Image upload
   - Ticket price (optional)
   - Max attendees (optional)
   - Publish button

##### **Profile Tab**
1. **Profile Screen**
   - Profile header (photo, name, username, bio)
   - Neighborhood badge
   - Stats (posts, listings, events)
   - Menu items:
     - My Posts
     - My Listings
     - My Events
     - Messages
     - Notifications
     - Settings
     - Help & Support
     - Logout

2. **Messages Screen**
   - Conversation list
   - Unread indicators
   - Search conversations

3. **Chat Screen**
   - Message bubbles
   - Media sharing
   - Typing indicators
   - Read receipts
   - Input bar with send button

4. **Notifications Screen**
   - Notification list
   - Unread badges
   - Tap to navigate to content
   - Mark as read

5. **Settings Screen**
   - Profile settings
   - Notification preferences
   - Language selection
   - Privacy settings
   - Account security
   - About Mtaa
   - Terms & Conditions
   - Privacy Policy

### Android App (Kotlin/Jetpack Compose)

**Structure mirrors iOS app with Material Design 3 components:**
- Bottom Navigation Bar (same tabs)
- Material Design components
- Swipe gestures
- Material You theming
- Same screen flows as iOS

### Key Features Across Both Platforms

- **Offline Support**: Cache recent posts, queue actions for sync
- **Push Notifications**: Real-time alerts for safety, messages, interactions
- **Dark Mode**: System-aware dark/light theme
- **Localization**: English/Swahili with RTL support
- **Accessibility**: VoiceOver/TalkBack support, large text, high contrast
- **Performance**: Image lazy loading, pagination, efficient caching

---

## 6. Security Model

### Authentication

#### **SMS OTP Authentication**
- 6-digit OTP codes
- 5-minute expiration
- Rate limiting: 3 attempts per phone number per hour
- OTP stored in Redis with TTL
- One-time use only
- SMS delivery via Safaricom API (primary) or Twilio (backup)

#### **JWT Token Management**
- **Access Token**: 15-minute expiration, stored in memory
- **Refresh Token**: 30-day expiration, stored securely (Keychain/Keystore)
- Token rotation on refresh
- Blacklist revoked tokens in Redis
- Device fingerprinting for additional security

#### **Session Management**
- One session per device
- Session invalidation on logout
- Automatic logout after 30 days of inactivity
- Device management in user settings

### Role-Based Access Control (RBAC)

#### **User Roles**
1. **Regular User**
   - Create posts, comments, listings, events
   - Report content
   - Message other users
   - View neighborhood content

2. **Neighborhood Admin**
   - All regular user permissions
   - Moderate neighborhood content
   - Verify safety alerts
   - Manage neighborhood settings

3. **Platform Moderator**
   - All user permissions
   - Review moderation queue
   - Resolve user reports
   - Ban/suspend users
   - View analytics

4. **Platform Admin**
   - All permissions
   - System configuration
   - Neighborhood management
   - User management (all users)
   - Platform-wide analytics

### Data Protection

#### **Encryption**
- **In Transit**: TLS 1.3 for all API communications
- **At Rest**: AES-256 encryption for sensitive data (PII, payment info)
- **Database**: Encrypted columns for phone numbers, emails
- **Media**: Encrypted storage in S3 with signed URLs (expiring)

#### **PII Protection**
- Phone numbers: Hashed in logs, encrypted in DB
- Location data: Aggregated for analytics, precise only for active features
- GDPR-compliant data retention policies
- User data export on request
- Account deletion with data purging

#### **Payment Security**
- M-Pesa API integration with secure credentials
- Transaction IDs stored (not payment details)
- PCI-DSS compliance considerations
- Payment webhooks with signature verification

### Content Moderation

#### **Automated Moderation**
- **AI Content Filtering**: 
  - Profanity detection (Swahili + English)
  - Spam detection
  - Image moderation (inappropriate content)
  - Duplicate content detection
- **Automated Flagging**:
  - High report count threshold (5+ reports)
  - Suspicious activity patterns
  - New account restrictions (first 10 posts reviewed)

#### **Human Moderation**
- Moderation queue for flagged content
- Priority queue for safety alerts
- Moderator dashboard with review tools
- Appeal process for rejected content

#### **User Reporting**
- Report categories: Spam, Harassment, Inappropriate, Fake, Scam
- Anonymous reporting option
- Report tracking and follow-up
- Auto-ban for repeat offenders

### API Security

#### **Rate Limiting**
- Per-user rate limits (100 requests/minute)
- Per-endpoint limits (stricter for auth, payments)
- IP-based rate limiting for public endpoints
- Exponential backoff for exceeded limits

#### **Input Validation**
- Schema validation for all requests
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- File upload validation (type, size, content scanning)

#### **CORS & Headers**
- CORS configured for mobile apps only
- Security headers (HSTS, CSP, X-Frame-Options)
- API versioning to prevent breaking changes

### Location Security

#### **Location Verification**
- Geofencing for neighborhood boundaries
- Address verification via Google Maps API
- Location spoofing detection
- Manual verification for edge cases

#### **Privacy Controls**
- Users can hide exact location
- Neighborhood-level location only (not precise coordinates)
- Location data not shared with third parties
- Opt-out for location-based features

### Incident Response

#### **Security Monitoring**
- Real-time anomaly detection
- Failed login attempt tracking
- Suspicious activity alerts
- Automated threat response

#### **Data Breach Protocol**
- Immediate incident response team activation
- User notification within 72 hours
- Regulatory reporting (if required)
- Security audit and remediation

---

## 7. MVP Breakdown

### Phase 1: Foundation (Weeks 1-4)

#### **Backend Infrastructure**
- [ ] Set up microservices architecture
- [ ] PostgreSQL database setup with core tables
- [ ] Redis for caching and sessions
- [ ] API Gateway configuration
- [ ] Basic authentication service (SMS OTP)
- [ ] JWT token management
- [ ] Location service (neighborhood boundaries)
- [ ] Media service (image upload to S3)

#### **Mobile Apps - Core**
- [ ] Onboarding flow (phone, OTP, neighborhood selection)
- [ ] User authentication
- [ ] Home feed (posts list)
- [ ] Create post screen
- [ ] Post detail with comments
- [ ] Basic profile screen
- [ ] Settings screen

#### **Integrations**
- [ ] Safaricom SMS API integration
- [ ] Google Maps API integration
- [ ] Firebase Cloud Messaging setup
- [ ] S3 bucket configuration

**Deliverable**: Users can register, verify location, create posts, and view neighborhood feed.

---

### Phase 2: Core Features (Weeks 5-8)

#### **Posts & Engagement**
- [ ] Post categories
- [ ] Post reactions (likes)
- [ ] Comments and nested replies
- [ ] Post media (images)
- [ ] Post search and filters
- [ ] Trending algorithm

#### **Safety Alerts**
- [ ] Safety alert creation
- [ ] Alert feed with severity indicators
- [ ] Alert verification
- [ ] Alert map view
- [ ] SMS notifications for critical alerts

#### **User Management**
- [ ] Profile editing
- [ ] Profile images
- [ ] User search
- [ ] Follow/neighbor connections (optional)

**Deliverable**: Full posts functionality, safety alerts, enhanced user profiles.

---

### Phase 3: Marketplace (Weeks 9-12)

#### **Marketplace Core**
- [ ] Listing creation
- [ ] Listing feed with filters
- [ ] Listing detail screen
- [ ] Image upload (multiple)
- [ ] Search marketplace
- [ ] Category filters

#### **M-Pesa Integration**
- [ ] M-Pesa API integration
- [ ] Payment flow in app
- [ ] Transaction history
- [ ] Payment confirmations

**Deliverable**: Functional marketplace with M-Pesa payments.

---

### Phase 4: Events & Messaging (Weeks 13-16)

#### **Events**
- [ ] Event creation
- [ ] Event feed
- [ ] Event detail with RSVP
- [ ] Calendar integration
- [ ] Event reminders (push notifications)

#### **Messaging**
- [ ] Direct messaging
- [ ] Conversation list
- [ ] Real-time message delivery (WebSocket)
- [ ] Media sharing in messages
- [ ] Read receipts

**Deliverable**: Events and messaging functionality.

---

### Phase 5: Moderation & Admin (Weeks 17-20)

#### **Content Moderation**
- [ ] Automated content filtering
- [ ] User reporting system
- [ ] Moderation queue
- [ ] Admin dashboard
- [ ] Ban/suspension management

#### **Analytics**
- [ ] User engagement metrics
- [ ] Content performance tracking
- [ ] Safety incident analytics
- [ ] Admin dashboards

**Deliverable**: Moderation tools and analytics.

---

### Phase 6: Polish & Optimization (Weeks 21-24)

#### **Performance**
- [ ] Database query optimization
- [ ] Caching strategy implementation
- [ ] Image optimization and CDN
- [ ] API response time optimization
- [ ] Mobile app performance tuning

#### **UX Enhancements**
- [ ] Offline support
- [ ] Push notification improvements
- [ ] Swahili localization
- [ ] Dark mode
- [ ] Accessibility improvements

#### **Testing & QA**
- [ ] Unit tests (backend)
- [ ] Integration tests
- [ ] E2E tests (mobile)
- [ ] Load testing
- [ ] Security audit

**Deliverable**: Production-ready platform with optimizations.

---

## 8. Developer Checklist

### Pre-Development Setup

#### **Development Environment**
- [ ] Install Node.js 18+ (for backend services)
- [ ] Install Python 3.10+ (for some microservices)
- [ ] Install PostgreSQL 14+
- [ ] Install Redis 7+
- [ ] Install Docker & Docker Compose (for local development)
- [ ] Install Xcode 14+ (for iOS development)
- [ ] Install Android Studio (for Android development)
- [ ] Set up Git repository with branching strategy
- [ ] Configure CI/CD pipeline (GitHub Actions/GitLab CI)

#### **Cloud Infrastructure**
- [ ] AWS account setup (or alternative cloud provider)
- [ ] S3 bucket creation for media storage
- [ ] CloudFront CDN configuration
- [ ] RDS PostgreSQL instance (or local for dev)
- [ ] ElastiCache Redis instance (or local for dev)
- [ ] VPC and security groups configuration
- [ ] Load balancer setup
- [ ] Domain name registration and SSL certificates

#### **Third-Party Services**
- [ ] Safaricom Developer account and API credentials
- [ ] M-Pesa API credentials and sandbox access
- [ ] Google Maps API key
- [ ] Firebase project setup (FCM)
- [ ] Twilio account (SMS backup)
- [ ] Sentry account (error tracking)
- [ ] Analytics service (optional: Mixpanel, Amplitude)

#### **Database Setup**
- [ ] Create database schema migrations
- [ ] Set up database backup strategy
- [ ] Configure connection pooling
- [ ] Set up database monitoring
- [ ] Create seed data for development

#### **API Development**
- [ ] Set up API Gateway (Kong/AWS API Gateway)
- [ ] Configure rate limiting
- [ ] Set up API documentation (Swagger/OpenAPI)
- [ ] Implement request/response logging
- [ ] Set up API versioning strategy
- [ ] Configure CORS policies

#### **Security Setup**
- [ ] Generate JWT secret keys
- [ ] Set up environment variable management (AWS Secrets Manager/Vault)
- [ ] Configure SSL/TLS certificates
- [ ] Set up WAF (Web Application Firewall)
- [ ] Implement DDoS protection
- [ ] Set up security monitoring and alerts

#### **Mobile Development**
- [ ] iOS: Apple Developer account
- [ ] iOS: App Store Connect setup
- [ ] Android: Google Play Console account
- [ ] Configure push notification certificates (APNs)
- [ ] Set up Firebase for Android push notifications
- [ ] Configure app signing keys
- [ ] Set up app analytics (Firebase Analytics)

#### **Testing Infrastructure**
- [ ] Set up unit testing framework
- [ ] Set up integration testing environment
- [ ] Set up E2E testing (Appium/Detox)
- [ ] Configure test data management
- [ ] Set up performance testing tools

#### **Documentation**
- [ ] API documentation (Swagger/Postman)
- [ ] Database schema documentation
- [ ] Architecture decision records (ADRs)
- [ ] Deployment runbooks
- [ ] Incident response procedures
- [ ] User guide (for admins/moderators)

#### **Localization**
- [ ] Set up i18n framework (mobile apps)
- [ ] Create translation files (English/Swahili)
- [ ] Set up translation management workflow
- [ ] Test RTL support (if needed)

#### **Monitoring & Observability**
- [ ] Set up application monitoring (New Relic/Datadog)
- [ ] Configure log aggregation (CloudWatch/ELK)
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up alerting (PagerDuty/Opsgenie)

#### **Compliance & Legal**
- [ ] Privacy Policy draft
- [ ] Terms of Service draft
- [ ] Data Protection Impact Assessment (DPIA)
- [ ] GDPR compliance checklist (if applicable)
- [ ] Kenyan data protection regulations review

#### **Team Setup**
- [ ] Define development workflow (Git flow, feature branches)
- [ ] Set up code review process
- [ ] Configure project management tools (Jira/Trello)
- [ ] Set up communication channels (Slack/Discord)
- [ ] Define on-call rotation schedule

---

## Additional Considerations

### Kenyan-Specific Features

- **M-Pesa Integration**: Primary payment method, seamless in-app payments
- **Safaricom SMS**: Primary SMS provider, fallback to Twilio
- **Local Language Support**: Swahili translations for all UI elements
- **Neighborhood Boundaries**: Accurate mapping of Kenyan neighborhoods
- **Local Regulations**: Compliance with Kenyan data protection laws
- **Network Optimization**: Optimized for 3G/4G networks, low data usage

### Scalability Considerations

- **Horizontal Scaling**: Microservices can scale independently
- **Database Sharding**: By neighborhood_id for posts/content
- **CDN**: Global content delivery for media
- **Caching Strategy**: Multi-layer caching (Redis, application, CDN)
- **Load Balancing**: Multiple instances behind load balancer
- **Auto-scaling**: Based on CPU/memory/request metrics

### Future Enhancements (Post-MVP)

- Group chats for neighborhoods
- Video posts and live streaming
- Business profiles and advertising
- Integration with local services (delivery, services)
- Advanced analytics for neighborhood admins
- Mobile money wallet integration
- Voice messages
- Neighborhood polls and voting

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Specification



