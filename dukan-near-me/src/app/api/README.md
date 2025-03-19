# Backend Details

This document provides an overview of how frontend developers can interact with the backend authentication system.

## **Backend Overview**
The backend is built using **Next.js** with **NextAuth.js** for authentication. It handles user authentication via **credentials (email & password)** and manages sessions using **JWT tokens**.

## **Authentication Endpoints**
Since authentication is managed by **NextAuth.js**, there are no custom API endpoints for login, signup, or logout. Instead, use the built-in NextAuth methods in the frontend.

### **1️⃣ Signup (User Registration)**
- **Route:** `/api/auth/signup` (Handled internally by NextAuth)
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **How to Use in Frontend (React Example)**
  ```tsx
  import { signIn } from "next-auth/react";
  
  const handleSignup = async () => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    
    if (response.ok) {
      signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
    }
  };
  ```

### **2️⃣ Login (Sign In)**
- **Handled by NextAuth.js**
- **How to Use in Frontend**
  ```tsx
  import { signIn } from "next-auth/react";
  
  const handleLogin = async () => {
    await signIn("credentials", { email, password, redirect: true, callbackUrl: "/dashboard" });
  };
  ```

### **3️⃣ Logout (Sign Out)**
- **Handled by NextAuth.js**
- **How to Use in Frontend**
  ```tsx
  import { signOut } from "next-auth/react";
  
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  ```

## **Checking Authentication in Frontend**
To check the user session and role in any page:
```tsx
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>You are not logged in.</p>;
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Your role: {session.user.role}</p>
    </div>
  );
};
```

## **Middleware for Route Protection**
The backend uses **middleware.js** to protect routes like `/dashboard`. If an unauthenticated user tries to access these routes, they will be redirected to `/login`.

## **Session API (Fetching User Info from Backend)**
If you need to check the logged-in user’s details:
- **Route:** `/api/auth/session`
- **Method:** `GET`
- **How to Fetch in Frontend**
  ```tsx
  const fetchSession = async () => {
    const res = await fetch("/api/auth/session");
    const session = await res.json();
    console.log(session);
  };
  ```

## **Conclusion**
- **Use `signIn()` for login.**
- **Use `signOut()` for logout.**
- **Use `useSession()` to check authentication status.**
- **Protected routes like `/dashboard` require authentication.**

This backend is fully integrated with NextAuth.js, so you **don’t need to manually handle tokens**—it’s all built-in. 🚀

