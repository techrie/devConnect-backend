# ⚙️ DevConnect Backend API

A backend REST API built with Node.js, Express, and MongoDB for a developer networking platform.  
This server handles authentication, user management, connection requests, and social graph logic.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- cookie-parser
- validator
- nodemon (development)

---

## 📦 Setup & Installation

### 1. Clone repository

```bash
git clone https://github.com/techrie/devConnect-backend.git
cd devConnect-backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run server

```bash
npm run dev
```

Server runs on:

```
http://localhost:7777
```

---

## 🧠 Project Architecture

```
Client (React)
   ↓
Express Server (Node.js)
   ↓
MongoDB Database
```

---

## 🔌 API Features

### 👤 Authentication

- Signup API
- Login API
- Logout API
- JWT-based authentication
- Password hashing using bcrypt

---

### 👨‍💻 User APIs

- Get user by ID
- Get user by email
- Update user profile
- Delete user
- Feed API (paginated users list)

---

### 🤝 Connection System

- Send connection request
- Review request (accept/reject)
- Get received requests
- Get user connections

---

## 🛠 Core Concepts Implemented

### 🔐 Authentication & Security

- JWT token generation & validation
- Cookie-based authentication
- Password encryption using bcrypt
- Protected routes using middleware

---

### 🧩 Express Concepts

- Routing (GET, POST, PATCH, DELETE)
- Route params & query params
- Middleware chaining
- Custom middleware (auth, admin checks)
- Error handling middleware

---

### 🗄️ MongoDB & Mongoose

- Schema design with validations
- Required, unique, minLength, trim, default
- Custom validators
- Pre-save hooks
- Compound indexes
- Query operators ($and, $or, $nin, $ne)
- Pagination using skip & limit
- Populate for relationships

---

## ⚙️ API Design Concepts Practiced

- RESTful API design
- Route grouping using Express Router
- Modular code structure
- Separation of concerns (routes, controllers, models)
- Data validation & sanitization
- Never trusting req.body (server-side validation)

---

## 📚 Key Learnings

- How Express handles requests internally
- Middleware flow in Node.js
- Designing scalable backend architecture
- Secure authentication systems using JWT
- MongoDB schema design for social networks
- Handling edge cases in APIs
- Pagination and query optimization
- Building real-world backend systems from scratch

---

## 🧪 Tools Used

- Postman (API testing)
- MongoDB Atlas (cloud database)
- Nodemon (auto-restart server)

---

## 🔮 Future Improvements

- Real-time chat using WebSockets
- Rate limiting for APIs
- Refresh token system
- Image upload (profile pictures)
- Notification system
