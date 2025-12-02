# Mtaa Implementation Roadmap

Based on the comprehensive tech specification, this document outlines the implementation plan.

## Current Status

### ✅ Completed
- Basic authentication (register, login, OTP via phone/email)
- User model with basic fields
- Basic Post and Comment models
- Frontend: Login, Register, Forgot Password pages
- SQLite database setup

### 🚧 In Progress
- Comprehensive database schema (just created)

### 📋 To Do
- All features from the tech spec

---

## Phase 1: Foundation & Database (Week 1-2)

### Database Schema ✅
- [x] Create comprehensive Prisma schema with all models
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or migrate)
- [ ] Seed initial neighborhoods (Nairobi, Mombasa, Kisumu)
- [ ] Create database indexes for performance

### User Management
- [ ] Update User model to support roles (Regular, Lead, Business, Agency, Admin)
- [ ] Implement role-based access control (RBAC)
- [ ] Add multiple neighborhoods per user (UserNeighborhood)
- [ ] Address verification with geocoding
- [ ] Government ID verification workflow

### Authentication Enhancements
- [ ] SMS OTP integration (Africa's Talking or similar)
- [ ] Email verification (optional secondary)
- [ ] Social login (Google, Facebook - optional)
- [ ] Two-factor authentication for admins

---

## Phase 2: Core Features - Posts & Feed (Week 3-5)

### Post Types
- [ ] Implement PostType enum (General, Safety, Recommendation, Event, Marketplace, Lost & Found, News)
- [ ] Create post creation endpoints for each type
- [ ] Post media handling (images up to 10, videos up to 5)
- [ ] Image upload to cloud storage (S3/Cloudinary)
- [ ] Video processing and optimization

### Feed Algorithm
- [ ] Implement engagement score calculation: `(likes × 1) + (comments × 3) + (shares × 5) - (reports × 10)`
- [ ] Priority ordering:
  1. Pinned posts by neighborhood leads
  2. Safety alerts (last 24 hours)
  3. Posts from followed users
  4. Recent posts (last 7 days) by engagement score
  5. Older posts by relevance
- [ ] Feed filtering (All, Safety, Events, For Sale, Recommendations)
- [ ] Infinite scroll with pagination

### Post Interactions
- [ ] Like/Unlike posts
- [ ] Comments with nested replies
- [ ] Share functionality
- [ ] Report posts
- [ ] Pin posts (neighborhood leads only)

---

## Phase 3: Safety Alerts (Week 6-7)

### Safety Alert System
- [ ] Create SafetyAlert model and endpoints
- [ ] Alert categories (Crime, Fire, Accident, Suspicious Activity, Natural Disaster, Other)
- [ ] Priority feed placement (top of feed)
- [ ] Push notifications to all neighborhood members
- [ ] 24-hour auto-expiry with extension option
- [ ] Alert verification workflow

### Safety Map
- [ ] Interactive map view (Google Maps/Mapbox)
- [ ] Color-coded markers by alert type
- [ ] Cluster markers when zoomed out
- [ ] Filter by date range and alert type
- [ ] Show alerts from last 30 days

---

## Phase 4: Recommendations (Week 8-9)

### Recommendation System
- [ ] Create Recommendation model
- [ ] Categories: Home Services, Healthcare, Education, Automotive, Childcare, Pet Services, Food & Dining
- [ ] Ask for recommendations vs. give recommendations
- [ ] Tag business names
- [ ] Rating system (1-5 stars)
- [ ] Filter and search by category
- [ ] Business response to recommendations

---

## Phase 5: Marketplace (Week 10-12)

### Marketplace Listings
- [ ] Create MarketplaceListing model
- [ ] Categories: Furniture, Electronics, Clothing, Books, Toys, Appliances, Vehicles
- [ ] Required fields: Title, price (or "Free"), category, condition, description, photos (up to 8)
- [ ] Optional: Pickup location, delivery options
- [ ] Auto-expire listings after 30 days with renewal
- [ ] Mark as sold/given away
- [ ] Search and filter marketplace

### M-Pesa Integration (Future)
- [ ] M-Pesa API integration (Safaricom Daraja)
- [ ] Payment flow in app
- [ ] Transaction history
- [ ] Payment confirmations

---

## Phase 6: Events (Week 13-14)

### Event System
- [ ] Create Event model
- [ ] Event categories: Community Meetings, Garage Sales, Sports, Classes, Social Gatherings
- [ ] RSVP functionality (Going/Interested/Can't Go)
- [ ] Event reminders (push notifications 1 day and 1 hour before)
- [ ] Recurring events support
- [ ] Calendar view
- [ ] Event feed and discovery

---

## Phase 7: Direct Messaging (Week 15-16)

### Messaging System
- [ ] Create Conversation and Message models
- [ ] Private 1-on-1 messaging
- [ ] Text, images, location sharing
- [ ] Real-time messaging (WebSocket)
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Message encryption (TLS)
- [ ] Block/report functionality
- [ ] Rate limiting (max 5 new conversations per day)
- [ ] AI moderation for inappropriate content

---

## Phase 8: Business & Agency Accounts (Week 17-18)

### Business Accounts
- [ ] Create BusinessProfile model
- [ ] Business registration workflow
- [ ] Business profile: Name, category, address, phone, hours, website, description
- [ ] Post as business (limited to 3 posts per week)
- [ ] Respond to recommendations and reviews
- [ ] Analytics dashboard
- [ ] Verification badge upon approval
- [ ] Annual re-verification

### Public Agency Accounts
- [ ] Create AgencyProfile model
- [ ] Official government/NGO badge
- [ ] Unlimited posting (no frequency limits)
- [ ] Priority in news feed for official announcements
- [ ] Post to multiple neighborhoods simultaneously
- [ ] Analytics dashboard
- [ ] Verification workflow

---

## Phase 9: Content Moderation (Week 19-20)

### Moderation System
- [ ] AI-powered content moderation
- [ ] Keyword filtering
- [ ] User reporting system
- [ ] Admin review queue
- [ ] Three-strike policy
- [ ] Automated flagging
- [ ] Ban/suspension management
- [ ] Appeal process

---

## Phase 10: Notifications (Week 21)

### Notification System
- [ ] Create Notification model
- [ ] Push notifications (FCM)
- [ ] SMS notifications (critical alerts)
- [ ] In-app notifications
- [ ] Notification preferences
- [ ] Notification history
- [ ] Real-time notification delivery

---

## Phase 11: Location & Geocoding (Week 22)

### Location Services
- [ ] Google Maps Geocoding API integration
- [ ] Address verification
- [ ] Neighborhood boundary checking
- [ ] Support for multiple addresses (work and home)
- [ ] Re-verification if user moves
- [ ] Nearby neighborhoods feature (opt-in, 500m, 1km, 2km radius)

---

## Phase 12: Admin Panel (Week 23-24)

### Admin Dashboard
- [ ] User management (view, verify, suspend)
- [ ] Content moderation interface
- [ ] Neighborhood management
- [ ] Business verification
- [ ] Agency verification
- [ ] Analytics dashboard
- [ ] System health monitoring
- [ ] Admin authentication with 2FA

---

## Phase 13: Mobile Apps (Ongoing)

### iOS App
- [ ] Native Swift/SwiftUI app
- [ ] Bottom tab navigation
- [ ] Home feed
- [ ] Post creation
- [ ] Profile management
- [ ] Push notifications
- [ ] Offline support

### Android App
- [ ] Native Kotlin/Jetpack Compose app
- [ ] Material Design 3
- [ ] Same features as iOS
- [ ] Push notifications
- [ ] Offline support

---

## Phase 14: Performance & Optimization (Week 25-26)

### Performance
- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] Image optimization (WebP, lazy loading)
- [ ] CDN for static assets
- [ ] API response time optimization (< 200ms)
- [ ] Mobile app performance tuning

### UX Enhancements
- [ ] Offline support
- [ ] Swahili localization
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Progressive Web App (PWA)

---

## Phase 15: Testing & QA (Week 27-28)

### Testing
- [ ] Unit tests (backend)
- [ ] Integration tests
- [ ] E2E tests (mobile)
- [ ] Load testing
- [ ] Security audit
- [ ] Penetration testing

---

## Technical Integrations Needed

### Third-Party Services
1. **SMS**: Africa's Talking or similar African provider
2. **Maps**: Google Maps Platform or Mapbox
3. **Storage**: AWS S3, Google Cloud Storage, or Cloudinary
4. **Push Notifications**: Firebase Cloud Messaging (FCM)
5. **Payments**: M-Pesa API (Safaricom Daraja) - Future
6. **Content Moderation**: AWS Rekognition or Google Cloud Vision API
7. **Analytics**: Mixpanel, Amplitude, or Google Analytics

---

## Priority Order for MVP

Based on the spec's Phase 1 MVP requirements:

1. ✅ User registration and authentication
2. ✅ Neighborhood assignment based on location
3. ⏳ Basic news feed with general posts
4. ⏳ Safety alerts
5. ⏳ Direct messaging
6. ⏳ Mobile apps (iOS & Android)

---

## Next Immediate Steps

1. **Apply Database Schema**
   ```bash
   cd apps/backend
   npx prisma generate
   npx prisma db push
   ```

2. **Update Backend Services**
   - Update User service to handle roles
   - Create Post service with types
   - Create Safety Alert service
   - Create Event service
   - Create Marketplace service
   - Create Recommendation service
   - Create Messaging service

3. **Update Frontend**
   - Create home feed page
   - Create post creation forms
   - Create safety alerts page
   - Create events page
   - Create marketplace page
   - Create messaging interface

4. **Integrations**
   - Set up SMS provider (Africa's Talking)
   - Set up Google Maps API
   - Set up cloud storage (S3/Cloudinary)
   - Set up FCM for push notifications

---

## Notes

- This is a large-scale project requiring careful planning and phased implementation
- Start with MVP features and iterate
- Focus on core user experience first
- Security and moderation are critical for a community platform
- Performance optimization should be ongoing
- Mobile-first approach is essential for the Kenyan market



