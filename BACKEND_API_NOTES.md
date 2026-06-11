# Backend API & Database Requirements

## Frontend Changes (COMPLETED ✅)

The AddBusiness.jsx has been updated to redirect users **directly to their business profile page** after PIN setup instead of the My Business dashboard.

### Flow
```
1. User fills form → POST /public/register
2. Backend returns business data with _id
3. User sets PIN → POST /api/public/owner/set-pin
4. Frontend redirects → /business/{businessId}
```

---

## Backend API Requirements

### 1. **POST /public/register**
When business registration succeeds, the response MUST include:

**Current Expected Response:**
```json
{
  "business": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Business Name",
    "phone": "9876543210",
    ...
  }
}
```

Or alternatively:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Business Name",
  ...
}
```

**Frontend looks for:** `response?.business?._id || response?._id`

---

### 2. **POST /api/public/owner/set-pin**
When PIN is set successfully, the response SHOULD include businessId:

**Expected Response:**
```json
{
  "business": {
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

Or:
```json
{
  "_id": "507f1f77bcf86cd799439011"
}
```

---

### 3. **GET /api/public/businesses/{businessId}**
Must return the business document fast (used to display the profile page).

**This endpoint is critical for speed** - should:
- Have database index on `_id` field ✓
- Cache frequently accessed businesses (optional)
- Return within <500ms for fresh registrations

---

## Current API Endpoints Map

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/public/register` | Register new business |
| POST | `/api/public/owner/set-pin` | Create owner PIN |
| POST | `/api/public/owner/verify-pin` | Verify owner PIN |
| GET | `/api/public/businesses/{id}` | Get business by ID (CRITICAL) |
| GET | `/api/public/businesses` | List businesses (paginated) |
| POST | `/api/web-auth/signup` | Create web account |
| POST | `/api/web-auth/login` | Web account login |
| GET | `/api/web-auth/me` | Get current user + linked business |

---

## Database Optimization Status

### What's Already Fast:
- ✅ Business retrieval by ID (likely already indexed)
- ✅ Phone-based business lookup (scans public collection)
- ✅ Web auth check (account lookup by phone)

### What Needs Verification:
- 🔍 POST `/public/register` returns businessId
- 🔍 POST `/api/public/owner/set-pin` returns businessId
- 🔍 New businesses appear in DB immediately (no indexing delay)

---

## Frontend Session Management

After successful PIN setup:
```javascript
// Session is persisted with:
{
  user: { phone, businessId },
  business: { _id, name, phone, ... }
}
```

Then redirects to: `/business/{businessId}`

This shows the newly created business profile with all details.

---

## Verify Success

**After deployment, test with:**

1. Go to https://vanigan-app-automation-k3eb.vercel.app/add-business
2. Fill form with new phone number
3. After PIN setup, should see the new business profile page immediately
4. Business details should be fully loaded and visible

If it doesn't work:
- Check browser console (F12) for any errors
- Verify backend returns `_id` in registration response
- Check GET `/api/public/businesses/{id}` is returning data
