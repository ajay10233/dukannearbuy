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
| **GET** | `/api/payments`                 | Fetch payment history between users               | _Query Params_: `receiverId=456` |
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

