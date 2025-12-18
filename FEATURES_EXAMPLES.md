# 📚 Mtaa Features - Complete Examples Guide

This document provides comprehensive examples for all features in the Mtaa application.

---

## 1. 🏠 Personal Dashboard

### Frontend Usage
**URL**: `http://localhost:3000/dashboard`

### Example Dashboard Data
```json
{
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678",
    "bio": "Neighborhood enthusiast",
    "profileImageUrl": "https://example.com/profile.jpg"
  },
  "notifications": [
    {
      "id": "notif_1",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3,
  "activity": {
    "posts": 5,
    "listings": 2,
    "transactions": 1,
    "recommendations": 3
  }
}
```

### API Example - Get Dashboard Data
```bash
# Get current user
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get notifications
curl -X GET http://localhost:3001/api/v1/notifications?page=1&limit=5 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. 🛒 Marketplace - Browse and Search

### Frontend Usage
**URL**: `http://localhost:3000/marketplace`

### Example: Search Listings
```javascript
// Search for "coffee table" in Electronics category
const results = await marketplaceApi.getListings({
  search: "coffee table",
  category: "ELECTRONICS",
  page: 1,
  limit: 20
});
```

### API Example - Browse Listings
```bash
# Get all listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?page=1&limit=20"

# Search listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table&category=FURNITURE"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&page=1&limit=10"

# Get single listing
curl -X GET "http://localhost:3001/api/v1/marketplace/listings/listing_123"
```

### Example Response
```json
{
  "listings": [
    {
      "id": "listing_123",
      "title": "Vintage Coffee Table",
      "description": "Beautiful vintage coffee table in excellent condition. Made from solid wood.",
      "category": "FURNITURE",
      "price": 5000,
      "isFree": false,
      "condition": "GOOD",
      "images": [
        "https://example.com/table1.jpg",
        "https://example.com/table2.jpg"
      ],
      "pickupLocation": "Kilimani, Nairobi",
      "deliveryAvailable": true,
      "isSold": false,
      "author": {
        "id": "user_123",
        "username": "johndoe",
        "fullName": "John Doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "neighborhood": {
        "id": "neigh_123",
        "name": "Kilimani"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 3. 💰 Buy/Sell/Request Services

### Create a Listing
**Frontend URL**: `http://localhost:3000/marketplace/create`

### Example: Create Marketplace Listing
```javascript
const newListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "FURNITURE",
  title: "Vintage Coffee Table",
  description: "Beautiful vintage coffee table in excellent condition. Made from solid wood, perfect for your living room.",
  price: 5000,
  isFree: false,
  condition: "GOOD",
  images: [
    "https://example.com/table1.jpg",
    "https://example.com/table2.jpg",
    "https://example.com/table3.jpg"
  ],
  pickupLocation: "Kilimani, Nairobi",
  deliveryAvailable: true
});
```

### API Example - Create Listing
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "FURNITURE",
    "title": "Vintage Coffee Table",
    "description": "Beautiful vintage coffee table in excellent condition.",
    "price": 5000,
    "isFree": false,
    "condition": "GOOD",
    "images": [
      "https://example.com/table1.jpg",
      "https://example.com/table2.jpg"
    ],
    "pickupLocation": "Kilimani, Nairobi",
    "deliveryAvailable": true
  }'
```

### Example: Free Item Listing
```javascript
const freeListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "BOOKS",
  title: "Free Books - Various Genres",
  description: "Giving away books I no longer need. Fiction, non-fiction, and textbooks available.",
  isFree: true,
  images: ["https://example.com/books.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

### Mark Item as Sold
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings/listing_123/mark-sold \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Listing
```bash
curl -X PUT http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4500,
    "description": "Updated description with more details"
  }'
```

### Delete Listing
```bash
curl -X DELETE http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. 💬 Comments and Feedback

### Frontend Usage
**URL**: `http://localhost:3000/marketplace/[listingId]`

### Example: Add Comment to Listing
```javascript
// Create a comment on a listing's post
const comment = await postsApi.createComment(
  "post_123", // Post ID from the listing
  "This looks great! Is it still available?",
  undefined // No parent (top-level comment)
);
```

### API Example - Create Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This looks great! Is it still available?"
  }'
```

### Example: Reply to Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Yes, it is still available!",
    "parentId": "comment_456"
  }'
```

### Get Comments
```bash
curl -X GET "http://localhost:3001/api/v1/posts/post_123/comments?page=1&limit=20"
```

### Example Response
```json
{
  "comments": [
    {
      "id": "comment_123",
      "content": "This looks great! Is it still available?",
      "isEdited": false,
      "createdAt": "2024-01-15T11:00:00Z",
      "author": {
        "id": "user_456",
        "username": "janesmith",
        "fullName": "Jane Smith",
        "profileImageUrl": "https://example.com/jane.jpg"
      },
      "replies": [
        {
          "id": "comment_124",
          "content": "Yes, it is still available!",
          "author": {
            "id": "user_123",
            "username": "johndoe",
            "fullName": "John Doe"
          },
          "createdAt": "2024-01-15T11:05:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Like a Post/Listing
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Comment
```bash
curl -X PUT http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

### Delete Comment
```bash
curl -X DELETE http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5. 🔔 Notifications and Alerts

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/notifications`

### Example: Get All Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 20);
const unreadCount = await notificationsApi.getUnreadCount();
```

### API Example - Get Notifications
```bash
# Get all notifications
curl -X GET "http://localhost:3001/api/v1/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example Response
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "data": "{\"listingId\":\"listing_123\",\"userId\":\"user_456\"}",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "notif_124",
      "type": "POST_COMMENT",
      "title": "New comment on your post",
      "body": "John Doe commented on your listing",
      "isRead": true,
      "readAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:32:00Z"
    },
    {
      "id": "notif_125",
      "type": "SYSTEM_ANNOUNCEMENT",
      "title": "New Feature Available",
      "body": "Check out our new marketplace search feature!",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### Mark Notification as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/notif_123/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:3001/api/v1/notifications/notif_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Notification Types
- `NEW_MESSAGE` - New direct message received
- `POST_LIKE` - Someone liked your post
- `POST_COMMENT` - New comment on your post
- `SAFETY_ALERT` - Safety alert in your neighborhood
- `EVENT_REMINDER` - Event reminder
- `MARKETPLACE_INTEREST` - Interest in your marketplace listing
- `RECOMMENDATION_RESPONSE` - Response to your service request
- `SYSTEM_ANNOUNCEMENT` - System-wide announcement

---

## 6. ⚙️ Account Settings

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/settings`

### Example: Update Profile
```javascript
const updatedUser = await usersApi.updateProfile({
  fullName: "John Doe Updated",
  bio: "Updated bio text",
  languagePreference: "sw",
  mpesaNumber: "+254712345678"
});
```

### API Example - Update Profile
```bash
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe Updated",
    "bio": "Neighborhood enthusiast and coffee lover",
    "languagePreference": "sw",
    "mpesaNumber": "+254712345678",
    "email": "john.updated@example.com"
  }'
```

### Example Response
```json
{
  "id": "user_123",
  "username": "johndoe",
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "+254712345678",
  "bio": "Neighborhood enthusiast and coffee lover",
  "profileImageUrl": "https://example.com/profile.jpg",
  "languagePreference": "sw",
  "mpesaNumber": "+254712345678",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### Update Password
```bash
curl -X PUT http://localhost:3001/api/v1/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword456!"
  }'
```

### Example: Update Password (Frontend)
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

---

## 7. 🔐 Authentication Examples

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "email": "john@example.com",
    "neighborhoodId": "neigh_123",
    "address": "123 Main Street, Kilimani"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Example Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678"
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 8. 📱 Complete Workflow Examples

### Example 1: Complete Marketplace Transaction Flow

#### Step 1: User Creates Listing
```javascript
// User creates a listing
const listing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "ELECTRONICS",
  title: "iPhone 12 Pro Max",
  description: "Excellent condition, 128GB, comes with charger and case",
  price: 45000,
  condition: "LIKE_NEW",
  images: ["https://example.com/iphone1.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

#### Step 2: Another User Views Listing
```javascript
// Browse marketplace
const listings = await marketplaceApi.getListings({
  category: "ELECTRONICS",
  search: "iPhone"
});

// View specific listing
const listingDetails = await marketplaceApi.getListing(listing.id);
```

#### Step 3: User Comments on Listing
```javascript
// Add comment
const comment = await postsApi.createComment(
  listingDetails.post.id,
  "Is this still available? What's the battery health?"
);
```

#### Step 4: Seller Responds
```javascript
// Reply to comment
const reply = await postsApi.createComment(
  listingDetails.post.id,
  "Yes, still available! Battery health is 87%",
  comment.id // parent comment ID
);
```

#### Step 5: Mark as Sold
```javascript
// When transaction completes
await marketplaceApi.markAsSold(listing.id);
```

### Example 2: User Profile Management Flow

#### Step 1: User Updates Profile
```javascript
await usersApi.updateProfile({
  fullName: "John Doe",
  bio: "Tech enthusiast and neighborhood volunteer",
  mpesaNumber: "+254712345678"
});
```

#### Step 2: User Changes Password
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

#### Step 3: User Checks Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 10);
const unreadCount = await notificationsApi.getUnreadCount();

// Mark all as read
if (unreadCount > 0) {
  await notificationsApi.markAllAsRead();
}
```

---

## 9. 🎯 Category Examples

### Marketplace Categories
- `FURNITURE` - Tables, chairs, sofas, etc.
- `ELECTRONICS` - Phones, laptops, TVs, etc.
- `CLOTHING` - Clothes, shoes, accessories
- `BOOKS` - Textbooks, novels, magazines
- `TOYS` - Children's toys and games
- `APPLIANCES` - Refrigerators, washing machines, etc.
- `VEHICLES` - Cars, motorcycles, bicycles
- `OTHER` - Miscellaneous items

### Condition Values
- `NEW` - Brand new, never used
- `LIKE_NEW` - Excellent condition, barely used
- `GOOD` - Good condition, minor wear
- `FAIR` - Fair condition, some wear
- `POOR` - Poor condition, significant wear

---

## 10. 🔍 Search Examples

### Search by Text
```bash
# Search for "coffee table"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table"

# Search for "iPhone"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=iPhone&category=ELECTRONICS"
```

### Filter by Category
```bash
# Get all furniture listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=FURNITURE"

# Get electronics in specific neighborhood
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&neighborhoodId=neigh_123"
```

### Combined Search
```bash
# Search + Category + Pagination
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=laptop&category=ELECTRONICS&page=1&limit=10"
```

---

## 11. 📊 Error Handling Examples

### Example: Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### Example: Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    },
    {
      "field": "images",
      "message": "At least one image is required"
    }
  ]
}
```

### Example: Not Found
```json
{
  "statusCode": 404,
  "message": "Listing not found"
}
```

### Example: Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own listings"
}
```

---

## 12. 🧪 Testing Examples

### Test User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000001",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!",
    "email": "test@example.com"
  }'
```

### Test Create Listing
```bash
# First, get your access token from login
TOKEN="your_access_token_here"

curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "OTHER",
    "title": "Test Item",
    "description": "This is a test listing for development",
    "price": 1000,
    "images": ["https://via.placeholder.com/400"],
    "pickupLocation": "Test Location"
  }'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs should be publicly accessible
- Prices are in KES (Kenyan Shillings)
- All authenticated endpoints require `Authorization: Bearer <token>` header
- Pagination defaults: `page=1`, `limit=20`
- Maximum 8 images per marketplace listing
- Comments support nested replies (unlimited depth)

---

## 🔗 Quick Links

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Marketplace**: http://localhost:3000/marketplace
- **Settings**: http://localhost:3000/dashboard/settings
- **Notifications**: http://localhost:3000/dashboard/notifications
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs



This document provides comprehensive examples for all features in the Mtaa application.

---

## 1. 🏠 Personal Dashboard

### Frontend Usage
**URL**: `http://localhost:3000/dashboard`

### Example Dashboard Data
```json
{
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678",
    "bio": "Neighborhood enthusiast",
    "profileImageUrl": "https://example.com/profile.jpg"
  },
  "notifications": [
    {
      "id": "notif_1",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3,
  "activity": {
    "posts": 5,
    "listings": 2,
    "transactions": 1,
    "recommendations": 3
  }
}
```

### API Example - Get Dashboard Data
```bash
# Get current user
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get notifications
curl -X GET http://localhost:3001/api/v1/notifications?page=1&limit=5 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. 🛒 Marketplace - Browse and Search

### Frontend Usage
**URL**: `http://localhost:3000/marketplace`

### Example: Search Listings
```javascript
// Search for "coffee table" in Electronics category
const results = await marketplaceApi.getListings({
  search: "coffee table",
  category: "ELECTRONICS",
  page: 1,
  limit: 20
});
```

### API Example - Browse Listings
```bash
# Get all listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?page=1&limit=20"

# Search listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table&category=FURNITURE"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&page=1&limit=10"

# Get single listing
curl -X GET "http://localhost:3001/api/v1/marketplace/listings/listing_123"
```

### Example Response
```json
{
  "listings": [
    {
      "id": "listing_123",
      "title": "Vintage Coffee Table",
      "description": "Beautiful vintage coffee table in excellent condition. Made from solid wood.",
      "category": "FURNITURE",
      "price": 5000,
      "isFree": false,
      "condition": "GOOD",
      "images": [
        "https://example.com/table1.jpg",
        "https://example.com/table2.jpg"
      ],
      "pickupLocation": "Kilimani, Nairobi",
      "deliveryAvailable": true,
      "isSold": false,
      "author": {
        "id": "user_123",
        "username": "johndoe",
        "fullName": "John Doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "neighborhood": {
        "id": "neigh_123",
        "name": "Kilimani"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 3. 💰 Buy/Sell/Request Services

### Create a Listing
**Frontend URL**: `http://localhost:3000/marketplace/create`

### Example: Create Marketplace Listing
```javascript
const newListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "FURNITURE",
  title: "Vintage Coffee Table",
  description: "Beautiful vintage coffee table in excellent condition. Made from solid wood, perfect for your living room.",
  price: 5000,
  isFree: false,
  condition: "GOOD",
  images: [
    "https://example.com/table1.jpg",
    "https://example.com/table2.jpg",
    "https://example.com/table3.jpg"
  ],
  pickupLocation: "Kilimani, Nairobi",
  deliveryAvailable: true
});
```

### API Example - Create Listing
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "FURNITURE",
    "title": "Vintage Coffee Table",
    "description": "Beautiful vintage coffee table in excellent condition.",
    "price": 5000,
    "isFree": false,
    "condition": "GOOD",
    "images": [
      "https://example.com/table1.jpg",
      "https://example.com/table2.jpg"
    ],
    "pickupLocation": "Kilimani, Nairobi",
    "deliveryAvailable": true
  }'
```

### Example: Free Item Listing
```javascript
const freeListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "BOOKS",
  title: "Free Books - Various Genres",
  description: "Giving away books I no longer need. Fiction, non-fiction, and textbooks available.",
  isFree: true,
  images: ["https://example.com/books.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

### Mark Item as Sold
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings/listing_123/mark-sold \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Listing
```bash
curl -X PUT http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4500,
    "description": "Updated description with more details"
  }'
```

### Delete Listing
```bash
curl -X DELETE http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. 💬 Comments and Feedback

### Frontend Usage
**URL**: `http://localhost:3000/marketplace/[listingId]`

### Example: Add Comment to Listing
```javascript
// Create a comment on a listing's post
const comment = await postsApi.createComment(
  "post_123", // Post ID from the listing
  "This looks great! Is it still available?",
  undefined // No parent (top-level comment)
);
```

### API Example - Create Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This looks great! Is it still available?"
  }'
```

### Example: Reply to Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Yes, it is still available!",
    "parentId": "comment_456"
  }'
```

### Get Comments
```bash
curl -X GET "http://localhost:3001/api/v1/posts/post_123/comments?page=1&limit=20"
```

### Example Response
```json
{
  "comments": [
    {
      "id": "comment_123",
      "content": "This looks great! Is it still available?",
      "isEdited": false,
      "createdAt": "2024-01-15T11:00:00Z",
      "author": {
        "id": "user_456",
        "username": "janesmith",
        "fullName": "Jane Smith",
        "profileImageUrl": "https://example.com/jane.jpg"
      },
      "replies": [
        {
          "id": "comment_124",
          "content": "Yes, it is still available!",
          "author": {
            "id": "user_123",
            "username": "johndoe",
            "fullName": "John Doe"
          },
          "createdAt": "2024-01-15T11:05:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Like a Post/Listing
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Comment
```bash
curl -X PUT http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

### Delete Comment
```bash
curl -X DELETE http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5. 🔔 Notifications and Alerts

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/notifications`

### Example: Get All Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 20);
const unreadCount = await notificationsApi.getUnreadCount();
```

### API Example - Get Notifications
```bash
# Get all notifications
curl -X GET "http://localhost:3001/api/v1/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example Response
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "data": "{\"listingId\":\"listing_123\",\"userId\":\"user_456\"}",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "notif_124",
      "type": "POST_COMMENT",
      "title": "New comment on your post",
      "body": "John Doe commented on your listing",
      "isRead": true,
      "readAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:32:00Z"
    },
    {
      "id": "notif_125",
      "type": "SYSTEM_ANNOUNCEMENT",
      "title": "New Feature Available",
      "body": "Check out our new marketplace search feature!",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### Mark Notification as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/notif_123/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:3001/api/v1/notifications/notif_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Notification Types
- `NEW_MESSAGE` - New direct message received
- `POST_LIKE` - Someone liked your post
- `POST_COMMENT` - New comment on your post
- `SAFETY_ALERT` - Safety alert in your neighborhood
- `EVENT_REMINDER` - Event reminder
- `MARKETPLACE_INTEREST` - Interest in your marketplace listing
- `RECOMMENDATION_RESPONSE` - Response to your service request
- `SYSTEM_ANNOUNCEMENT` - System-wide announcement

---

## 6. ⚙️ Account Settings

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/settings`

### Example: Update Profile
```javascript
const updatedUser = await usersApi.updateProfile({
  fullName: "John Doe Updated",
  bio: "Updated bio text",
  languagePreference: "sw",
  mpesaNumber: "+254712345678"
});
```

### API Example - Update Profile
```bash
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe Updated",
    "bio": "Neighborhood enthusiast and coffee lover",
    "languagePreference": "sw",
    "mpesaNumber": "+254712345678",
    "email": "john.updated@example.com"
  }'
```

### Example Response
```json
{
  "id": "user_123",
  "username": "johndoe",
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "+254712345678",
  "bio": "Neighborhood enthusiast and coffee lover",
  "profileImageUrl": "https://example.com/profile.jpg",
  "languagePreference": "sw",
  "mpesaNumber": "+254712345678",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### Update Password
```bash
curl -X PUT http://localhost:3001/api/v1/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword456!"
  }'
```

### Example: Update Password (Frontend)
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

---

## 7. 🔐 Authentication Examples

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "email": "john@example.com",
    "neighborhoodId": "neigh_123",
    "address": "123 Main Street, Kilimani"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Example Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678"
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 8. 📱 Complete Workflow Examples

### Example 1: Complete Marketplace Transaction Flow

#### Step 1: User Creates Listing
```javascript
// User creates a listing
const listing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "ELECTRONICS",
  title: "iPhone 12 Pro Max",
  description: "Excellent condition, 128GB, comes with charger and case",
  price: 45000,
  condition: "LIKE_NEW",
  images: ["https://example.com/iphone1.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

#### Step 2: Another User Views Listing
```javascript
// Browse marketplace
const listings = await marketplaceApi.getListings({
  category: "ELECTRONICS",
  search: "iPhone"
});

// View specific listing
const listingDetails = await marketplaceApi.getListing(listing.id);
```

#### Step 3: User Comments on Listing
```javascript
// Add comment
const comment = await postsApi.createComment(
  listingDetails.post.id,
  "Is this still available? What's the battery health?"
);
```

#### Step 4: Seller Responds
```javascript
// Reply to comment
const reply = await postsApi.createComment(
  listingDetails.post.id,
  "Yes, still available! Battery health is 87%",
  comment.id // parent comment ID
);
```

#### Step 5: Mark as Sold
```javascript
// When transaction completes
await marketplaceApi.markAsSold(listing.id);
```

### Example 2: User Profile Management Flow

#### Step 1: User Updates Profile
```javascript
await usersApi.updateProfile({
  fullName: "John Doe",
  bio: "Tech enthusiast and neighborhood volunteer",
  mpesaNumber: "+254712345678"
});
```

#### Step 2: User Changes Password
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

#### Step 3: User Checks Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 10);
const unreadCount = await notificationsApi.getUnreadCount();

// Mark all as read
if (unreadCount > 0) {
  await notificationsApi.markAllAsRead();
}
```

---

## 9. 🎯 Category Examples

### Marketplace Categories
- `FURNITURE` - Tables, chairs, sofas, etc.
- `ELECTRONICS` - Phones, laptops, TVs, etc.
- `CLOTHING` - Clothes, shoes, accessories
- `BOOKS` - Textbooks, novels, magazines
- `TOYS` - Children's toys and games
- `APPLIANCES` - Refrigerators, washing machines, etc.
- `VEHICLES` - Cars, motorcycles, bicycles
- `OTHER` - Miscellaneous items

### Condition Values
- `NEW` - Brand new, never used
- `LIKE_NEW` - Excellent condition, barely used
- `GOOD` - Good condition, minor wear
- `FAIR` - Fair condition, some wear
- `POOR` - Poor condition, significant wear

---

## 10. 🔍 Search Examples

### Search by Text
```bash
# Search for "coffee table"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table"

# Search for "iPhone"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=iPhone&category=ELECTRONICS"
```

### Filter by Category
```bash
# Get all furniture listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=FURNITURE"

# Get electronics in specific neighborhood
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&neighborhoodId=neigh_123"
```

### Combined Search
```bash
# Search + Category + Pagination
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=laptop&category=ELECTRONICS&page=1&limit=10"
```

---

## 11. 📊 Error Handling Examples

### Example: Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### Example: Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    },
    {
      "field": "images",
      "message": "At least one image is required"
    }
  ]
}
```

### Example: Not Found
```json
{
  "statusCode": 404,
  "message": "Listing not found"
}
```

### Example: Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own listings"
}
```

---

## 12. 🧪 Testing Examples

### Test User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000001",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!",
    "email": "test@example.com"
  }'
```

### Test Create Listing
```bash
# First, get your access token from login
TOKEN="your_access_token_here"

curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "OTHER",
    "title": "Test Item",
    "description": "This is a test listing for development",
    "price": 1000,
    "images": ["https://via.placeholder.com/400"],
    "pickupLocation": "Test Location"
  }'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs should be publicly accessible
- Prices are in KES (Kenyan Shillings)
- All authenticated endpoints require `Authorization: Bearer <token>` header
- Pagination defaults: `page=1`, `limit=20`
- Maximum 8 images per marketplace listing
- Comments support nested replies (unlimited depth)

---

## 🔗 Quick Links

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Marketplace**: http://localhost:3000/marketplace
- **Settings**: http://localhost:3000/dashboard/settings
- **Notifications**: http://localhost:3000/dashboard/notifications
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs



This document provides comprehensive examples for all features in the Mtaa application.

---

## 1. 🏠 Personal Dashboard

### Frontend Usage
**URL**: `http://localhost:3000/dashboard`

### Example Dashboard Data
```json
{
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678",
    "bio": "Neighborhood enthusiast",
    "profileImageUrl": "https://example.com/profile.jpg"
  },
  "notifications": [
    {
      "id": "notif_1",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3,
  "activity": {
    "posts": 5,
    "listings": 2,
    "transactions": 1,
    "recommendations": 3
  }
}
```

### API Example - Get Dashboard Data
```bash
# Get current user
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get notifications
curl -X GET http://localhost:3001/api/v1/notifications?page=1&limit=5 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. 🛒 Marketplace - Browse and Search

### Frontend Usage
**URL**: `http://localhost:3000/marketplace`

### Example: Search Listings
```javascript
// Search for "coffee table" in Electronics category
const results = await marketplaceApi.getListings({
  search: "coffee table",
  category: "ELECTRONICS",
  page: 1,
  limit: 20
});
```

### API Example - Browse Listings
```bash
# Get all listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?page=1&limit=20"

# Search listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table&category=FURNITURE"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&page=1&limit=10"

# Get single listing
curl -X GET "http://localhost:3001/api/v1/marketplace/listings/listing_123"
```

### Example Response
```json
{
  "listings": [
    {
      "id": "listing_123",
      "title": "Vintage Coffee Table",
      "description": "Beautiful vintage coffee table in excellent condition. Made from solid wood.",
      "category": "FURNITURE",
      "price": 5000,
      "isFree": false,
      "condition": "GOOD",
      "images": [
        "https://example.com/table1.jpg",
        "https://example.com/table2.jpg"
      ],
      "pickupLocation": "Kilimani, Nairobi",
      "deliveryAvailable": true,
      "isSold": false,
      "author": {
        "id": "user_123",
        "username": "johndoe",
        "fullName": "John Doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "neighborhood": {
        "id": "neigh_123",
        "name": "Kilimani"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 3. 💰 Buy/Sell/Request Services

### Create a Listing
**Frontend URL**: `http://localhost:3000/marketplace/create`

### Example: Create Marketplace Listing
```javascript
const newListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "FURNITURE",
  title: "Vintage Coffee Table",
  description: "Beautiful vintage coffee table in excellent condition. Made from solid wood, perfect for your living room.",
  price: 5000,
  isFree: false,
  condition: "GOOD",
  images: [
    "https://example.com/table1.jpg",
    "https://example.com/table2.jpg",
    "https://example.com/table3.jpg"
  ],
  pickupLocation: "Kilimani, Nairobi",
  deliveryAvailable: true
});
```

### API Example - Create Listing
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "FURNITURE",
    "title": "Vintage Coffee Table",
    "description": "Beautiful vintage coffee table in excellent condition.",
    "price": 5000,
    "isFree": false,
    "condition": "GOOD",
    "images": [
      "https://example.com/table1.jpg",
      "https://example.com/table2.jpg"
    ],
    "pickupLocation": "Kilimani, Nairobi",
    "deliveryAvailable": true
  }'
```

### Example: Free Item Listing
```javascript
const freeListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "BOOKS",
  title: "Free Books - Various Genres",
  description: "Giving away books I no longer need. Fiction, non-fiction, and textbooks available.",
  isFree: true,
  images: ["https://example.com/books.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

### Mark Item as Sold
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings/listing_123/mark-sold \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Listing
```bash
curl -X PUT http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4500,
    "description": "Updated description with more details"
  }'
```

### Delete Listing
```bash
curl -X DELETE http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. 💬 Comments and Feedback

### Frontend Usage
**URL**: `http://localhost:3000/marketplace/[listingId]`

### Example: Add Comment to Listing
```javascript
// Create a comment on a listing's post
const comment = await postsApi.createComment(
  "post_123", // Post ID from the listing
  "This looks great! Is it still available?",
  undefined // No parent (top-level comment)
);
```

### API Example - Create Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This looks great! Is it still available?"
  }'
```

### Example: Reply to Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Yes, it is still available!",
    "parentId": "comment_456"
  }'
```

### Get Comments
```bash
curl -X GET "http://localhost:3001/api/v1/posts/post_123/comments?page=1&limit=20"
```

### Example Response
```json
{
  "comments": [
    {
      "id": "comment_123",
      "content": "This looks great! Is it still available?",
      "isEdited": false,
      "createdAt": "2024-01-15T11:00:00Z",
      "author": {
        "id": "user_456",
        "username": "janesmith",
        "fullName": "Jane Smith",
        "profileImageUrl": "https://example.com/jane.jpg"
      },
      "replies": [
        {
          "id": "comment_124",
          "content": "Yes, it is still available!",
          "author": {
            "id": "user_123",
            "username": "johndoe",
            "fullName": "John Doe"
          },
          "createdAt": "2024-01-15T11:05:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Like a Post/Listing
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Comment
```bash
curl -X PUT http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

### Delete Comment
```bash
curl -X DELETE http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5. 🔔 Notifications and Alerts

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/notifications`

### Example: Get All Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 20);
const unreadCount = await notificationsApi.getUnreadCount();
```

### API Example - Get Notifications
```bash
# Get all notifications
curl -X GET "http://localhost:3001/api/v1/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example Response
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "data": "{\"listingId\":\"listing_123\",\"userId\":\"user_456\"}",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "notif_124",
      "type": "POST_COMMENT",
      "title": "New comment on your post",
      "body": "John Doe commented on your listing",
      "isRead": true,
      "readAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:32:00Z"
    },
    {
      "id": "notif_125",
      "type": "SYSTEM_ANNOUNCEMENT",
      "title": "New Feature Available",
      "body": "Check out our new marketplace search feature!",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### Mark Notification as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/notif_123/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:3001/api/v1/notifications/notif_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Notification Types
- `NEW_MESSAGE` - New direct message received
- `POST_LIKE` - Someone liked your post
- `POST_COMMENT` - New comment on your post
- `SAFETY_ALERT` - Safety alert in your neighborhood
- `EVENT_REMINDER` - Event reminder
- `MARKETPLACE_INTEREST` - Interest in your marketplace listing
- `RECOMMENDATION_RESPONSE` - Response to your service request
- `SYSTEM_ANNOUNCEMENT` - System-wide announcement

---

## 6. ⚙️ Account Settings

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/settings`

### Example: Update Profile
```javascript
const updatedUser = await usersApi.updateProfile({
  fullName: "John Doe Updated",
  bio: "Updated bio text",
  languagePreference: "sw",
  mpesaNumber: "+254712345678"
});
```

### API Example - Update Profile
```bash
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe Updated",
    "bio": "Neighborhood enthusiast and coffee lover",
    "languagePreference": "sw",
    "mpesaNumber": "+254712345678",
    "email": "john.updated@example.com"
  }'
```

### Example Response
```json
{
  "id": "user_123",
  "username": "johndoe",
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "+254712345678",
  "bio": "Neighborhood enthusiast and coffee lover",
  "profileImageUrl": "https://example.com/profile.jpg",
  "languagePreference": "sw",
  "mpesaNumber": "+254712345678",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### Update Password
```bash
curl -X PUT http://localhost:3001/api/v1/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword456!"
  }'
```

### Example: Update Password (Frontend)
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

---

## 7. 🔐 Authentication Examples

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "email": "john@example.com",
    "neighborhoodId": "neigh_123",
    "address": "123 Main Street, Kilimani"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Example Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678"
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 8. 📱 Complete Workflow Examples

### Example 1: Complete Marketplace Transaction Flow

#### Step 1: User Creates Listing
```javascript
// User creates a listing
const listing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "ELECTRONICS",
  title: "iPhone 12 Pro Max",
  description: "Excellent condition, 128GB, comes with charger and case",
  price: 45000,
  condition: "LIKE_NEW",
  images: ["https://example.com/iphone1.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

#### Step 2: Another User Views Listing
```javascript
// Browse marketplace
const listings = await marketplaceApi.getListings({
  category: "ELECTRONICS",
  search: "iPhone"
});

// View specific listing
const listingDetails = await marketplaceApi.getListing(listing.id);
```

#### Step 3: User Comments on Listing
```javascript
// Add comment
const comment = await postsApi.createComment(
  listingDetails.post.id,
  "Is this still available? What's the battery health?"
);
```

#### Step 4: Seller Responds
```javascript
// Reply to comment
const reply = await postsApi.createComment(
  listingDetails.post.id,
  "Yes, still available! Battery health is 87%",
  comment.id // parent comment ID
);
```

#### Step 5: Mark as Sold
```javascript
// When transaction completes
await marketplaceApi.markAsSold(listing.id);
```

### Example 2: User Profile Management Flow

#### Step 1: User Updates Profile
```javascript
await usersApi.updateProfile({
  fullName: "John Doe",
  bio: "Tech enthusiast and neighborhood volunteer",
  mpesaNumber: "+254712345678"
});
```

#### Step 2: User Changes Password
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

#### Step 3: User Checks Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 10);
const unreadCount = await notificationsApi.getUnreadCount();

// Mark all as read
if (unreadCount > 0) {
  await notificationsApi.markAllAsRead();
}
```

---

## 9. 🎯 Category Examples

### Marketplace Categories
- `FURNITURE` - Tables, chairs, sofas, etc.
- `ELECTRONICS` - Phones, laptops, TVs, etc.
- `CLOTHING` - Clothes, shoes, accessories
- `BOOKS` - Textbooks, novels, magazines
- `TOYS` - Children's toys and games
- `APPLIANCES` - Refrigerators, washing machines, etc.
- `VEHICLES` - Cars, motorcycles, bicycles
- `OTHER` - Miscellaneous items

### Condition Values
- `NEW` - Brand new, never used
- `LIKE_NEW` - Excellent condition, barely used
- `GOOD` - Good condition, minor wear
- `FAIR` - Fair condition, some wear
- `POOR` - Poor condition, significant wear

---

## 10. 🔍 Search Examples

### Search by Text
```bash
# Search for "coffee table"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table"

# Search for "iPhone"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=iPhone&category=ELECTRONICS"
```

### Filter by Category
```bash
# Get all furniture listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=FURNITURE"

# Get electronics in specific neighborhood
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&neighborhoodId=neigh_123"
```

### Combined Search
```bash
# Search + Category + Pagination
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=laptop&category=ELECTRONICS&page=1&limit=10"
```

---

## 11. 📊 Error Handling Examples

### Example: Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### Example: Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    },
    {
      "field": "images",
      "message": "At least one image is required"
    }
  ]
}
```

### Example: Not Found
```json
{
  "statusCode": 404,
  "message": "Listing not found"
}
```

### Example: Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own listings"
}
```

---

## 12. 🧪 Testing Examples

### Test User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000001",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!",
    "email": "test@example.com"
  }'
```

### Test Create Listing
```bash
# First, get your access token from login
TOKEN="your_access_token_here"

curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "OTHER",
    "title": "Test Item",
    "description": "This is a test listing for development",
    "price": 1000,
    "images": ["https://via.placeholder.com/400"],
    "pickupLocation": "Test Location"
  }'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs should be publicly accessible
- Prices are in KES (Kenyan Shillings)
- All authenticated endpoints require `Authorization: Bearer <token>` header
- Pagination defaults: `page=1`, `limit=20`
- Maximum 8 images per marketplace listing
- Comments support nested replies (unlimited depth)

---

## 🔗 Quick Links

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Marketplace**: http://localhost:3000/marketplace
- **Settings**: http://localhost:3000/dashboard/settings
- **Notifications**: http://localhost:3000/dashboard/notifications
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs



This document provides comprehensive examples for all features in the Mtaa application.

---

## 1. 🏠 Personal Dashboard

### Frontend Usage
**URL**: `http://localhost:3000/dashboard`

### Example Dashboard Data
```json
{
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678",
    "bio": "Neighborhood enthusiast",
    "profileImageUrl": "https://example.com/profile.jpg"
  },
  "notifications": [
    {
      "id": "notif_1",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 3,
  "activity": {
    "posts": 5,
    "listings": 2,
    "transactions": 1,
    "recommendations": 3
  }
}
```

### API Example - Get Dashboard Data
```bash
# Get current user
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get notifications
curl -X GET http://localhost:3001/api/v1/notifications?page=1&limit=5 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. 🛒 Marketplace - Browse and Search

### Frontend Usage
**URL**: `http://localhost:3000/marketplace`

### Example: Search Listings
```javascript
// Search for "coffee table" in Electronics category
const results = await marketplaceApi.getListings({
  search: "coffee table",
  category: "ELECTRONICS",
  page: 1,
  limit: 20
});
```

### API Example - Browse Listings
```bash
# Get all listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?page=1&limit=20"

# Search listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table&category=FURNITURE"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&page=1&limit=10"

# Get single listing
curl -X GET "http://localhost:3001/api/v1/marketplace/listings/listing_123"
```

### Example Response
```json
{
  "listings": [
    {
      "id": "listing_123",
      "title": "Vintage Coffee Table",
      "description": "Beautiful vintage coffee table in excellent condition. Made from solid wood.",
      "category": "FURNITURE",
      "price": 5000,
      "isFree": false,
      "condition": "GOOD",
      "images": [
        "https://example.com/table1.jpg",
        "https://example.com/table2.jpg"
      ],
      "pickupLocation": "Kilimani, Nairobi",
      "deliveryAvailable": true,
      "isSold": false,
      "author": {
        "id": "user_123",
        "username": "johndoe",
        "fullName": "John Doe",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "neighborhood": {
        "id": "neigh_123",
        "name": "Kilimani"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## 3. 💰 Buy/Sell/Request Services

### Create a Listing
**Frontend URL**: `http://localhost:3000/marketplace/create`

### Example: Create Marketplace Listing
```javascript
const newListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "FURNITURE",
  title: "Vintage Coffee Table",
  description: "Beautiful vintage coffee table in excellent condition. Made from solid wood, perfect for your living room.",
  price: 5000,
  isFree: false,
  condition: "GOOD",
  images: [
    "https://example.com/table1.jpg",
    "https://example.com/table2.jpg",
    "https://example.com/table3.jpg"
  ],
  pickupLocation: "Kilimani, Nairobi",
  deliveryAvailable: true
});
```

### API Example - Create Listing
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "FURNITURE",
    "title": "Vintage Coffee Table",
    "description": "Beautiful vintage coffee table in excellent condition.",
    "price": 5000,
    "isFree": false,
    "condition": "GOOD",
    "images": [
      "https://example.com/table1.jpg",
      "https://example.com/table2.jpg"
    ],
    "pickupLocation": "Kilimani, Nairobi",
    "deliveryAvailable": true
  }'
```

### Example: Free Item Listing
```javascript
const freeListing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "BOOKS",
  title: "Free Books - Various Genres",
  description: "Giving away books I no longer need. Fiction, non-fiction, and textbooks available.",
  isFree: true,
  images: ["https://example.com/books.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

### Mark Item as Sold
```bash
curl -X POST http://localhost:3001/api/v1/marketplace/listings/listing_123/mark-sold \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Listing
```bash
curl -X PUT http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4500,
    "description": "Updated description with more details"
  }'
```

### Delete Listing
```bash
curl -X DELETE http://localhost:3001/api/v1/marketplace/listings/listing_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. 💬 Comments and Feedback

### Frontend Usage
**URL**: `http://localhost:3000/marketplace/[listingId]`

### Example: Add Comment to Listing
```javascript
// Create a comment on a listing's post
const comment = await postsApi.createComment(
  "post_123", // Post ID from the listing
  "This looks great! Is it still available?",
  undefined // No parent (top-level comment)
);
```

### API Example - Create Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This looks great! Is it still available?"
  }'
```

### Example: Reply to Comment
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Yes, it is still available!",
    "parentId": "comment_456"
  }'
```

### Get Comments
```bash
curl -X GET "http://localhost:3001/api/v1/posts/post_123/comments?page=1&limit=20"
```

### Example Response
```json
{
  "comments": [
    {
      "id": "comment_123",
      "content": "This looks great! Is it still available?",
      "isEdited": false,
      "createdAt": "2024-01-15T11:00:00Z",
      "author": {
        "id": "user_456",
        "username": "janesmith",
        "fullName": "Jane Smith",
        "profileImageUrl": "https://example.com/jane.jpg"
      },
      "replies": [
        {
          "id": "comment_124",
          "content": "Yes, it is still available!",
          "author": {
            "id": "user_123",
            "username": "johndoe",
            "fullName": "John Doe"
          },
          "createdAt": "2024-01-15T11:05:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Like a Post/Listing
```bash
curl -X POST http://localhost:3001/api/v1/posts/post_123/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Comment
```bash
curl -X PUT http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

### Delete Comment
```bash
curl -X DELETE http://localhost:3001/api/v1/posts/comments/comment_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5. 🔔 Notifications and Alerts

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/notifications`

### Example: Get All Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 20);
const unreadCount = await notificationsApi.getUnreadCount();
```

### API Example - Get Notifications
```bash
# Get all notifications
curl -X GET "http://localhost:3001/api/v1/notifications?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get unread count
curl -X GET http://localhost:3001/api/v1/notifications/unread-count \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Example Response
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "MARKETPLACE_INTEREST",
      "title": "Someone is interested in your listing",
      "body": "Jane Smith showed interest in your 'Vintage Coffee Table'",
      "data": "{\"listingId\":\"listing_123\",\"userId\":\"user_456\"}",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "notif_124",
      "type": "POST_COMMENT",
      "title": "New comment on your post",
      "body": "John Doe commented on your listing",
      "isRead": true,
      "readAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:32:00Z"
    },
    {
      "id": "notif_125",
      "type": "SYSTEM_ANNOUNCEMENT",
      "title": "New Feature Available",
      "body": "Check out our new marketplace search feature!",
      "isRead": false,
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### Mark Notification as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/notif_123/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:3001/api/v1/notifications/read-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:3001/api/v1/notifications/notif_123 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Notification Types
- `NEW_MESSAGE` - New direct message received
- `POST_LIKE` - Someone liked your post
- `POST_COMMENT` - New comment on your post
- `SAFETY_ALERT` - Safety alert in your neighborhood
- `EVENT_REMINDER` - Event reminder
- `MARKETPLACE_INTEREST` - Interest in your marketplace listing
- `RECOMMENDATION_RESPONSE` - Response to your service request
- `SYSTEM_ANNOUNCEMENT` - System-wide announcement

---

## 6. ⚙️ Account Settings

### Frontend Usage
**URL**: `http://localhost:3000/dashboard/settings`

### Example: Update Profile
```javascript
const updatedUser = await usersApi.updateProfile({
  fullName: "John Doe Updated",
  bio: "Updated bio text",
  languagePreference: "sw",
  mpesaNumber: "+254712345678"
});
```

### API Example - Update Profile
```bash
curl -X PUT http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe Updated",
    "bio": "Neighborhood enthusiast and coffee lover",
    "languagePreference": "sw",
    "mpesaNumber": "+254712345678",
    "email": "john.updated@example.com"
  }'
```

### Example Response
```json
{
  "id": "user_123",
  "username": "johndoe",
  "fullName": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "+254712345678",
  "bio": "Neighborhood enthusiast and coffee lover",
  "profileImageUrl": "https://example.com/profile.jpg",
  "languagePreference": "sw",
  "mpesaNumber": "+254712345678",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

### Update Password
```bash
curl -X PUT http://localhost:3001/api/v1/users/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPassword123!",
    "newPassword": "NewSecurePassword456!"
  }'
```

### Example: Update Password (Frontend)
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

---

## 7. 🔐 Authentication Examples

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "email": "john@example.com",
    "neighborhoodId": "neigh_123",
    "address": "123 Main Street, Kilimani"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Example Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+254712345678"
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 8. 📱 Complete Workflow Examples

### Example 1: Complete Marketplace Transaction Flow

#### Step 1: User Creates Listing
```javascript
// User creates a listing
const listing = await marketplaceApi.createListing({
  neighborhoodId: "neigh_123",
  category: "ELECTRONICS",
  title: "iPhone 12 Pro Max",
  description: "Excellent condition, 128GB, comes with charger and case",
  price: 45000,
  condition: "LIKE_NEW",
  images: ["https://example.com/iphone1.jpg"],
  pickupLocation: "Westlands, Nairobi"
});
```

#### Step 2: Another User Views Listing
```javascript
// Browse marketplace
const listings = await marketplaceApi.getListings({
  category: "ELECTRONICS",
  search: "iPhone"
});

// View specific listing
const listingDetails = await marketplaceApi.getListing(listing.id);
```

#### Step 3: User Comments on Listing
```javascript
// Add comment
const comment = await postsApi.createComment(
  listingDetails.post.id,
  "Is this still available? What's the battery health?"
);
```

#### Step 4: Seller Responds
```javascript
// Reply to comment
const reply = await postsApi.createComment(
  listingDetails.post.id,
  "Yes, still available! Battery health is 87%",
  comment.id // parent comment ID
);
```

#### Step 5: Mark as Sold
```javascript
// When transaction completes
await marketplaceApi.markAsSold(listing.id);
```

### Example 2: User Profile Management Flow

#### Step 1: User Updates Profile
```javascript
await usersApi.updateProfile({
  fullName: "John Doe",
  bio: "Tech enthusiast and neighborhood volunteer",
  mpesaNumber: "+254712345678"
});
```

#### Step 2: User Changes Password
```javascript
await usersApi.updatePassword(
  "OldPassword123!",
  "NewSecurePassword456!"
);
```

#### Step 3: User Checks Notifications
```javascript
const notifications = await notificationsApi.getAll(1, 10);
const unreadCount = await notificationsApi.getUnreadCount();

// Mark all as read
if (unreadCount > 0) {
  await notificationsApi.markAllAsRead();
}
```

---

## 9. 🎯 Category Examples

### Marketplace Categories
- `FURNITURE` - Tables, chairs, sofas, etc.
- `ELECTRONICS` - Phones, laptops, TVs, etc.
- `CLOTHING` - Clothes, shoes, accessories
- `BOOKS` - Textbooks, novels, magazines
- `TOYS` - Children's toys and games
- `APPLIANCES` - Refrigerators, washing machines, etc.
- `VEHICLES` - Cars, motorcycles, bicycles
- `OTHER` - Miscellaneous items

### Condition Values
- `NEW` - Brand new, never used
- `LIKE_NEW` - Excellent condition, barely used
- `GOOD` - Good condition, minor wear
- `FAIR` - Fair condition, some wear
- `POOR` - Poor condition, significant wear

---

## 10. 🔍 Search Examples

### Search by Text
```bash
# Search for "coffee table"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=coffee%20table"

# Search for "iPhone"
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=iPhone&category=ELECTRONICS"
```

### Filter by Category
```bash
# Get all furniture listings
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=FURNITURE"

# Get electronics in specific neighborhood
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?category=ELECTRONICS&neighborhoodId=neigh_123"
```

### Combined Search
```bash
# Search + Category + Pagination
curl -X GET "http://localhost:3001/api/v1/marketplace/listings?search=laptop&category=ELECTRONICS&page=1&limit=10"
```

---

## 11. 📊 Error Handling Examples

### Example: Invalid Token
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### Example: Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    },
    {
      "field": "images",
      "message": "At least one image is required"
    }
  ]
}
```

### Example: Not Found
```json
{
  "statusCode": 404,
  "message": "Listing not found"
}
```

### Example: Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own listings"
}
```

---

## 12. 🧪 Testing Examples

### Test User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000001",
    "fullName": "Test User",
    "username": "testuser",
    "password": "Test123!",
    "email": "test@example.com"
  }'
```

### Test Create Listing
```bash
# First, get your access token from login
TOKEN="your_access_token_here"

curl -X POST http://localhost:3001/api/v1/marketplace/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "neighborhoodId": "neigh_123",
    "category": "OTHER",
    "title": "Test Item",
    "description": "This is a test listing for development",
    "price": 1000,
    "images": ["https://via.placeholder.com/400"],
    "pickupLocation": "Test Location"
  }'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Image URLs should be publicly accessible
- Prices are in KES (Kenyan Shillings)
- All authenticated endpoints require `Authorization: Bearer <token>` header
- Pagination defaults: `page=1`, `limit=20`
- Maximum 8 images per marketplace listing
- Comments support nested replies (unlimited depth)

---

## 🔗 Quick Links

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Marketplace**: http://localhost:3000/marketplace
- **Settings**: http://localhost:3000/dashboard/settings
- **Notifications**: http://localhost:3000/dashboard/notifications
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs



















