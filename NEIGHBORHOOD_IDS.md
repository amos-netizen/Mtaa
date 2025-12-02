# Neighborhood IDs for Testing

These are the default test neighborhoods created when you seed the database.

---

## 🏘️ Available Neighborhoods

### 1. **Kilimani** (Nairobi)
```
ID: 123e4567-e89b-12d3-a456-426614174000
City: Nairobi
County: Nairobi
```

### 2. **Westlands** (Nairobi)
```
ID: 123e4567-e89b-12d3-a456-426614174001
City: Nairobi
County: Nairobi
```

### 3. **Kasarani** (Nairobi)
```
ID: 123e4567-e89b-12d3-a456-426614174002
City: Nairobi
County: Nairobi
```

### 4. **Kibera** (Nairobi)
```
ID: 123e4567-e89b-12d3-a456-426614174003
City: Nairobi
County: Nairobi
```

### 5. **Donholm** (Nairobi)
```
ID: 123e4567-e89b-12d3-a456-426614174004
City: Nairobi
County: Nairobi
```

---

## 🚀 How to Seed Neighborhoods

Once PostgreSQL is running and migrations are complete:

```powershell
cd C:\Users\amosm\OneDrive\Documents\PROJECTS\Mtaa\apps\backend
npm run prisma:seed
```

---

## 📝 Registration Examples

### Example 1: Register in Kilimani
```json
{
  "phoneNumber": "+254712345678",
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "Test@123",
  "neighborhoodId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Example 2: Register in Westlands
```json
{
  "phoneNumber": "+254712345679",
  "fullName": "Jane Smith",
  "username": "janesmith",
  "password": "Test@123",
  "neighborhoodId": "123e4567-e89b-12d3-a456-426614174001"
}
```

### Example 3: Register without neighborhood (optional)
```json
{
  "phoneNumber": "+254712345680",
  "fullName": "Bob Wilson",
  "username": "bobwilson",
  "password": "Test@123"
}
```

**Note:** `neighborhoodId` is optional. You can register without it.

---

## 🔍 Quick Copy-Paste IDs

For quick testing:

```
Kilimani:   123e4567-e89b-12d3-a456-426614174000
Westlands:  123e4567-e89b-12d3-a456-426614174001
Kasarani:   123e4567-e89b-12d3-a456-426614174002
Kibera:     123e4567-e89b-12d3-a456-426614174003
Donholm:    123e4567-e89b-12d3-a456-426614174004
```

---

## 🎯 Frontend Usage

Once the neighborhood selector is implemented, users will be able to:
1. Search for their neighborhood by name
2. Select from a dropdown list
3. See neighborhoods on a map

For now, manually enter one of the IDs above during registration.

---

## 🔧 Adding More Neighborhoods

Edit `apps/backend/prisma/seed.ts` and run:
```powershell
npm run prisma:seed
```

The seed script uses `upsert`, so it won't create duplicates.







