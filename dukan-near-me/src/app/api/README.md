# 📄 API: `/api/billformat`

Handles creation, reading, updating, and deletion of **bill format** settings for an institution.

---

## Common 🔖 Headers
| Key | Value |
|:---|:---|
| Content-Type | `application/json` |
| Authorization | (Session via `getServerSession`) |

---

## ➡️ `GET /api/billformat`
### Purpose: Fetch the institution's saved bill format.

### ✅ Success Response
```json
{
  "institutionId": "institution-id",
  "gstNumber": "22ABCDE1234F1Z5",
  "taxType": "GST",
  "taxPercentage": 18,
  "proprietorSign": "Base64 encoded signature or URL",
  "extraText": "Thank you for shopping!"
}
```

### ❌ Error Responses
- `401 Unauthorized` — User not an Institution or Shop Owner.
- `404 Not Found` — No bill format found for the institution.
- `500 Internal Server Error` — Unexpected error.

---

## ➡️ `POST /api/billformat`
### Purpose: Create a bill format. (Only one allowed per institution)

### 🧩 JSON Payload
```json
{
  "gstNumber": "22ABCDE1234F1Z5",
  "taxType": "GST",
  "taxPercentage": 18,
  "proprietorSign": "base64-string-or-url",
  "extraText": "Thanks for shopping!"
}
```

### ✅ Success Response
```json
{
  "institutionId": "institution-id",
  "gstNumber": "...",
  "taxType": "...",
  "taxPercentage": 18,
  "proprietorSign": "...",
  "extraText": "..."
}
```

### ❌ Error Responses
- `401 Unauthorized` — Not an institution or shop owner.
- `400 Bad Request` — Already created once.
- `500 Internal Server Error` — Unexpected error.

---

## ➡️ `PUT /api/billformat`
### Purpose: Update the existing bill format.

### 🧩 JSON Payload (Partial update allowed)
```json
{
  "gstNumber": "new-GST",
  "taxType": "VAT",
  "taxPercentage": 5,
  "proprietorSign": "updated-signature",
  "extraText": "Come Again!"
}
```
*(You can send only the fields you want to update.)*

### ✅ Success Response
```json
{
  "institutionId": "institution-id",
  "gstNumber": "...",
  "taxType": "...",
  "taxPercentage": 5,
  "proprietorSign": "...",
  "extraText": "Come Again!"
}
```

### ❌ Error Responses
- `401 Unauthorized`
- `404 Not Found` — No bill format to update.
- `500 Internal Server Error`

---

## ➡️ `DELETE /api/billformat`
### Purpose: Delete the saved bill format.

### ✅ Success Response
```json
{
  "message": "Bill format deleted successfully"
}
```

### ❌ Error Responses
- `401 Unauthorized`
- `404 Not Found` — No bill format found.
- `500 Internal Server Error`

---

# ⚙️ Important Common Requirements (for all `/api/billformat` routes)
- Only `INSTITUTION` and `SHOP_OWNER` roles are authorized.
- Each institution can create **only one** bill format.
- To update, a bill format must exist.
- Deleting removes the record permanently.


# 📄 Bill Creation API Documentation

---

## 📌 Endpoint
```
POST /api/bill
```

---

## 📌 Headers
| Key             | Value                     | Required |
|-----------------|----------------------------|:--------:|
| Content-Type    | application/json <br>OR<br> multipart/form-data | ✅ |
| Authorization   | Session Cookie (Handled by `getServerSession`) | ✅ |

---

## 📌 Authentication
- Must be authenticated via **NextAuth session**.
- Only roles **INSTITUTION** or **SHOP_OWNER** can access.
- Otherwise returns **401 Unauthorized**.

---

## 📌 Request Payloads

### ➡️ 1. JSON Body (For normal bill generation)
**Content-Type**: `application/json`

```json
{
  "userId": "string (user id)",
  "tokenId": "string (token id)",
  "name": "string (optional, customer name)",
  "phoneNumber": "string (optional, customer phone number)",
  "items": [
    {
      "name": "string (item name)",
      "price": number,
      "quantity": number
    }
  ],
  "remarks": "string (optional)",
  "invoiceNumber": "string (optional)",
  "otherCharges": number (optional, extra charges),
  "generateShortBill": true (optional, defaults to true)
}
```

✅ **Important Validations**:
- `items` array must not be empty.
- `otherCharges` must be a valid number.
- If `generateShortBill` is true, a short bill (summary) will also be created.

---

### ➡️ 2. FormData Body (For uploading bill as file)
**Content-Type**: `multipart/form-data`

| Field          | Type   | Required | Description |
|----------------|--------|:--------:|-------------|
| file           | File   | ✅ | PDF / Image file (JPEG, JPG, PNG) |
| userId         | String | ✅ | Customer's user ID |
| tokenId        | String | ✅ | Token ID associated with bill |
| remarks        | String | ❌ | Remarks (optional) |
| invoiceNumber  | String | ❌ | Invoice number (optional) |
| report         | Boolean/String | ❌ | If true, bill type is set as `REPORT` instead of `BILL` |

✅ **Important Validations**:
- File size limit depends on subscription plan (defaults to 1MB if not specified).
- Supported file types: `pdf`, `jpg`, `jpeg`, `png`.

---

## 📌 Response

### ✅ Success (for both JSON and FormData)

```json
{
  "success": true,
  "bill": { ...billObject },
  "shortBill": { ...shortBillObject } // Only for JSON and if generateShortBill = true
}
```

- `billObject` contains full bill data.
- `shortBillObject` contains short bill data (only if generated).

---

### ❌ Possible Error Responses

| Status Code | Error | Reason |
|-------------|-------|--------|
| 401 | `{ "error": "Unauthorized" }` | User is not authorized |
| 404 | `{ "error": "Institution not found" }` | Logged-in institution/shop not found |
| 403 | `{ "error": "Free plan limit reached. Upgrade to generate more than 1000 bills per month." }` | Free plan limit exceeded |
| 400 | `{ "error": "Invalid otherCharges" }` | otherCharges is not a valid number |
| 400 | `{ "error": "Unsupported file type. Only PDFs and Images are allowed." }` | Invalid file type |
| 400 | `{ "error": "No file uploaded" }` | No file provided |
| 400 | `{ "error": "File exceeds the upload limit of {maxUploadSizeMB}MB" }` | File too large |
| 500 | `{ "error": "Failed to create bill" }` | Server-side error |

---

## 📌 Notes
- Free plan institutions can only create **1000 bills per month**.
- Premium plans extend bill expiration and file upload limits.
- ShortBills (quick summary bills) expire **after 1 hour**.
- Uploaded files are stored in **Cloudinary**.





## 📩 Notification API

This API allows users to send, view, mark as read, and delete notifications. Notifications can be sent by any user or institution to another user. Only the receiver can delete or mark a notification as read.

## 📘 API Endpoints

All endpoints are under `/api/notification`.

---

### 🔹 POST `/api/notification`

**Description:** Create a new notification

**Request Body:**
```json
{
  "senderId": "string",
  "receiverId": "string",
  "title": "New message",
  "message": "You have a new appointment",
  "type": "info"
}
```

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "message": "...",
  "type": "...",
  "isRead": false,
  "senderId": "...",
  "receiverId": "...",
  "createdAt": "..."
}
```

---

### 🔹 GET `/api/notification`

**Description:** Fetch all notifications for the currently logged-in user

**Auth Required:** ✅ Yes

**Response:** `Array<Notification>`

```json
[
  {
    "id": "...",
    "title": "...",
    "message": "...",
    "type": "...",
    "isRead": false,
    "createdAt": "...",
    "senderId": "...",
    "receiverId": "..."
  }
]
```

---

### 🔹 GET `/api/notification/:id`

**Description:** Get a single notification by ID and mark it as read

**Auth Required:** ❌ No (can be added if needed)

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "message": "...",
  "type": "...",
  "isRead": true,
  "createdAt": "...",
  "senderId": "...",
  "receiverId": "..."
}
```

---

### 🔹 DELETE `/api/notification/:id`

**Description:** Delete a notification — only if you're the receiver

**Auth Required:** ✅ Yes

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

**Errors:**
- `403 Forbidden` – If the user is not the receiver
- `401 Unauthorized` – If not logged in

# Farvorite bills routes
## 📍 Base URL

```
/api/favorite-bills/
```

---

## 🔹 `GET` – Get All Favorite Bills for a User

### ✅ **Query Params:**

| Param   | Type   | Required | Description             |
|---------|--------|----------|-------------------------|
| userId  | String | ✅ Yes   | ID of the user          |

### 🔐 Auth:
- Requires session with role `USER`

### 🧾 **Example Request:**
```http
GET /api/favorite-bills?userId=661fe1d4b82e0b5db75f8e1f
```

### ✅ **Success Response:**
```json
[
  {
    "id": "66220b5cc55cc0e3a0a1f489",
    "userId": "661fe1d4b82e0b5db75f8e1f",
    "billId": "661fe5c7c88a91d845c3ed8b",
    "bill": {
      "id": "661fe5c7c88a91d845c3ed8b",
      "totalAmount": 200.5,
      "paymentStatus": "PAID",
      "invoiceNumber": "INV-20250412",
      ...
    }
  }
]
```

### ❌ Error Responses:
- `401 Unauthorized` – if no valid session or not a `USER`
- `400 Bad Request` – if `userId` is missing

---

## 🔹 `POST` – Add a Favorite Bill

### 📦 **Request Body:**
```json
{
  "userId": "661fe1d4b82e0b5db75f8e1f",
  "billId": "661fe5c7c88a91d845c3ed8b"
}
```

### 🔐 Auth:
- Requires session with role `USER`

### ✅ **Success Response:**
```json
{
  "id": "66220b5cc55cc0e3a0a1f489",
  "userId": "661fe1d4b82e0b5db75f8e1f",
  "billId": "661fe5c7c88a91d845c3ed8b"
}
```

### ⚠️ If Already Favorited:
```json
{
  "message": "Already favorited",
  "favorite": {
    "id": "66220b5cc55cc0e3a0a1f489",
    "userId": "661fe1d4b82e0b5db75f8e1f",
    "billId": "661fe5c7c88a91d845c3ed8b"
  }
}
```

### ❌ Error Responses:
- `401 Unauthorized` – if no valid session or not a `USER`
- `400 Bad Request` – missing fields
- `500 Server Error` – Prisma/internal error

---

## 🔹 `DELETE` – Remove a Favorite Bill

### ✅ **Query Params:**

| Param          | Type   | Required | Description              |
|----------------|--------|----------|--------------------------|
| favoriteBillId | String | ✅ Yes   | ID of the favorite entry |

### 🔐 Auth:
- Requires session with role `USER`

### 🧾 **Example Request:**
```http
DELETE /api/favorite-bills?favoriteBillId=66220b5cc55cc0e3a0a1f489
```

### ✅ **Success Response:**
```json
{
  "message": "Removed from favorites"
}
```

### ❌ Error Responses:
- `401 Unauthorized` – if not logged in or not a `USER`
- `400 Bad Request` – missing `favoriteBillId`
- `404 Not Found` – favorite record doesn't exist
- `500 Server Error` – Prisma/internal error


# Updated Work

- Users can login via email, phone or username as well | done
- Success status -> Only done by P or MI | done
- User can change status to conflict from pending only | done
- Edit details for payment | done
- User can change status to conflict in only 48 hours | done

- favourite institutions for users | done
<!-- - as soon as chat is completed show a popup for satisfied or not and then fill it with favourites -->
- only show rating option to the user only after minimum 5 responses from the insitution 
- if the MI generate bill then allow to give reivew
- chats will retain only for 48 hours but in gold plan it will persist accordingly to paid plans
- create a model for conversation to keep track of conversations for user and MI & MI and MI | done

25/02/25
- location part to fetch and show and store details for backend
# Backend Details

This document provides an overview of how frontend developers can interact with the backend authentication system.

## **Backend Overview**
The backend is built using **Next.js** with **NextAuth.js** for authentication. It handles user authentication via **credentials (email & password)** and manages sessions using **JWT tokens**.

## **Authentication Endpoints**
Since authentication is managed by **NextAuth.js**, there are no custom API endpoints for login, signup, or logout. Instead, use the built-in NextAuth methods in the frontend.

## **API Details**

### ✅ **All Routes Summary**

### 📌 **Institutions API (Updated)**
| Method  | Endpoint                      | Description                          | Request Body Example |
|---------|--------------------------------|--------------------------------------|----------------------|
| **GET** | `/api/institutions`           | Fetch all institutions              | _None_ |
| **GET** | `/api/institutions/:id`       | Fetch a single institution by ID    | _None_ |
| **POST** | `/api/institutions`         | Create a new institution            | `{ "name": "ABC Shop" }` |
| **PUT** | `/api/institutions/:id`       | Update an institution by ID         | `{ "name": "XYZ Store" }` |
| **DELETE** | `/api/institutions/:id`   | Delete an institution by ID         | _None_ |
| **POST** | `/api/institutions/upload-photo` | Upload photos for institution (Max 10) | `{ "images": ["data:image/png;base64,..."] }` |

---

### 📌 **Messages API**
| Method  | Endpoint                      | Description                                      | Request Body Example |
|---------|--------------------------------|--------------------------------------------------|----------------------|
| **GET** | `/api/messages`               | Fetch all messages                              | _None_ |
| **GET** | `/api/messages/:conversationId` | Fetch conversation between user & institution   | _None_ |
| **POST** | `/api/messages`              | Send a new message                              | `{ "senderId": "123", "receiverId": "456", "content": "Hello!" }` |
| **DELETE** | `/api/messages/:id`        | Delete a message by ID                          | _None_ |
| **GET** | `/api/messages/all`           | Fetch all messages for a user by userId & type | _None_ |
| **GET** | `/api/messages/conversation`  | Fetch conversation between logged-in user & institution by `receiverId` | _None_ |
| **DELETE** | `/api/messages/delete`     | Delete a message by `messageId` (query param)  | _None_ |
| **POST** | `/api/messages/send`         | Send a new message                             | `{ "senderId": "123", "senderType": "USER", "receiverId": "456", "content": "Hello!" }` |

---

### 📌 **Payments API (Updated)**
| Method  | Endpoint                        | Description                                        | Request Body Example |
|---------|---------------------------------|----------------------------------------------------|----------------------|
| **GET** | `/api/payments/history`                 | Fetch payment history between users               | _Query Params_: `receiverId=456` |
| **GET** | `/api/payments/update-payment`  | Fetch updated payment history for logged-in user  | _Query Params_: `receiverId=456` |
| **POST** | `/api/payments`                | Create a new payment transaction                  | `{ "senderId": "123", "receiverId": "456", "amount": 100, "status": "pending" }` |

---


### 📌 **Users API (Updated)**
| Method  | Endpoint                      | Description                                      | Request Body Example |
|---------|------------------------------|------------------------------------------------|----------------------|
| **GET** | `/api/users`                 | Fetch all users                                | _None_ |
| **POST** | `/api/users/upload-photo`   | Upload profile photo (Users only, not Institutions) | `{ "image": "data:image/png;base64,..." }` |

---

### 📌 **Socket.IO Integration**
The backend uses **Socket.IO** with **Redis** for real-time messaging. Below are the key events handled by the WebSocket server:

#### 🔹 **Socket Events**
| Event Name        | Description |
|------------------|-------------|
| `connection`     | When a user connects to the WebSocket server |
| `register`       | Registers a user by storing their socket ID in Redis |
| `sendMessage`    | Sends a message from a user to an institution |
| `disconnect`     | Removes the user from Redis when they disconnect |

#### 🔹 **Redis Pub/Sub**
- **Publisher:** Publishes messages to Redis on the `chat` channel.
- **Subscriber:** Listens for new messages and forwards them to the respective recipient.

#### 🔹 **Message Handling**
1. When a user sends a message via `sendMessage`, it is published to Redis.
2. The subscriber listens for new messages and stores them in MongoDB via Prisma.
3. If the receiver is online, the message is delivered instantly.
4. If the receiver is offline, the message remains in the database for later retrieval.

🚀 **Socket.IO is running on port `3001` with CORS enabled (`*`).**

