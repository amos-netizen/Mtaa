# Registration Guide - Mtaa Project

Quick reference for user registration in the Mtaa app.

---

## ✅ FIXED - Registration Form Now Works!

### What Was Fixed:
1. ✅ **Added password field** to frontend registration form
2. ✅ **Added email field** (optional) to frontend form
3. ✅ **Made neighborhood ID optional** (was incorrectly required)
4. ✅ **Updated shared types** to include password and email
5. ✅ **Added helpful placeholders** with example UUIDs

---

## 📝 Registration Form Fields

### Required Fields:
- ✅ **Phone Number**:+254712345 678
- ✅ **Full Name**: John Doe
- ✅ **Username**: johndoe (min 3 characters)
- ✅ **Password**: Test@123 (min 6 characters)

### Optional Fields:
- 📧 **Email**: john@example.com
- 🏘️ **Neighborhood ID**: 123e4567-e89b-12d3-a456-426614174000
- 📍 **Address**: 123 Main Street

---

## 🏘️ Neighborhood IDs for Testing

You can use these or **leave blank** (it's optional):

```
Kilimani:   123e4567-e89b-12d3-a456-426614174000
Westlands:  123e4567-e89b-12d3-a456-426614174001
Kasarani:   123e4567-e89b-12d3-a456-426614174002
Kibera:     123e4567-e89b-12d3-a456-426614174003
Donholm:    123e4567-e89b-12d3-a456-426614174004
```

---

## 🎯 Example Registration

### Option 1: With Neighborhood (Full Registration)
```json
{
  "phoneNumber": "+254712345678",
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "Test@123",
  "email": "john@example.com",
  "neighborhoodId": "123e4567-e89b-12d3-a456-426614174000",
  "address": "123 Main Street, Kilimani"
}
```

### Option 2: Without Neighborhood (Minimal Registration)
```json
{
  "phoneNumber": "+254712345678",
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "Test@123"
}
```

---

## 🚀 How to Register (Frontend)

1. **Go to**: http://localhost:3000/auth/register
2. **Fill in the form**:
   - Phone: `+254712345678`
   - Name: `John Doe`
   - Username: `johndoe`
   - Password: `Test@123`
   - Email: (leave blank or add email)
   - Neighborhood ID: (leave blank or paste one of the UUIDs above)
   - Address: (leave blank or add address)
3. **Click "Register"**
4. **Success!** You'll get tokens and be redirected to dashboard

---

## 🔑 After Registration

You'll receive:
- ✅ Access Token (JWT)
- ✅ Refresh Token
- ✅ User Profile Data

These are automatically stored in localStorage and you'll be redirected to `/dashboard`.

---

## ⚠️ Important Notes

### Neighborhood ID:
- **Currently**: Manual UUID entry or leave blank
- **Future**: Will be replaced with a neighborhood selector/dropdown
- **Status**: Optional field

### Password:
- **Minimum**: 6 characters
- **Hashed**: Using BCrypt with 10 rounds
- **Secure**: Never stored in plain text

### Phone Number:
- **Format**: +254712345678 (Kenya format)
- **Must be unique**: Cannot register same number twice

### Username:
- **Minimum**: 3 characters
- **Must be unique**: Cannot use existing username

---

## 🧪 Quick Test Registration

Once backend is running, use these test credentials:

```
Phone: +254700000001
Name: Test User One
Username: testuser1
Password: test123
```

Or via frontend form at http://localhost:3000/auth/register

---

## 📋 Field Validation Summary

| Field | Required | Min Length | Format | Unique |
|-------|----------|------------|--------|--------|
| Phone Number | Yes | 10 | +254... | Yes |
| Full Name | Yes | 2 | Any | No |
| Username | Yes | 3 | Alphanumeric | Yes |
| Password | Yes | 6 | Any | No |
| Email | No | - | email@format | Yes if provided |
| Neighborhood ID | No | - | Valid UUID | No |
| Address | No | - | Any | No |

---

**Ready to register once the backend database is set up!** 🎉







