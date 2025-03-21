# Backend Details

This document provides an overview of how frontend developers can interact with the backend authentication system.

## **Backend Overview**
The backend is built using **Next.js** with **NextAuth.js** for authentication. It handles user authentication via **credentials (email & password)** and manages sessions using **JWT tokens**.

## **Authentication Endpoints**
Since authentication is managed by **NextAuth.js**, there are no custom API endpoints for login, signup, or logout. Instead, use the built-in NextAuth methods in the frontend.

## **Api details**
### Messages api

## ✅ **All Routes Summary**

### 📌 **Institutions API**
| Method | Endpoint                 | Description                      | Request Body Example |
|--------|--------------------------|----------------------------------|----------------------|
| **GET** | `/api/institutions`      | Fetch all institutions          | _None_ |
| **GET** | `/api/institutions/:id`  | Fetch a single institution by ID | _None_ |
| **POST** | `/api/institutions`    | Create a new institution        | `{ "name": "ABC Shop" }` |
| **PUT** | `/api/institutions/:id`  | Update an institution by ID     | `{ "name": "XYZ Store" }` |
| **DELETE** | `/api/institutions/:id` | Delete an institution by ID | _None_ |

---

### 📌 **Messages API**
| Method | Endpoint                     | Description                                   | Request Body Example |
|--------|--------------------------------|-----------------------------------------------|----------------------|
| **GET** | `/api/messages`               | Fetch all messages                           | _None_ |
| **GET** | `/api/messages/:conversationId` | Fetch conversation between user & institution | _None_ |
| **POST** | `/api/messages`             | Send a new message                           | `{ "senderId": "123", "receiverId": "456", "content": "Hello!" }` |
| **DELETE** | `/api/messages/:id`       | Delete a message by ID                       | _None_ |

---

### 📌 **Users API**
| Method | Endpoint                | Description                      | Request Body Example |
|--------|-------------------------|----------------------------------|----------------------|
| **GET** | `/api/users`           | Fetch all users                  | _None_ |
| **GET** | `/api/users/:id`       | Fetch a single user by ID        | _None_ |
| **POST** | `/api/auth/signup`   | Register a new user              | `{ "name": "John Doe", "email": "john@example.com", "password": "securePass" }` |
| **POST** | `/api/auth/login`    | Authenticate user (login)        | `{ "email": "john@example.com", "password": "securePass" }` |
