# 📚 Bookstore REST API

A RESTful API built using **Node.js** and **Express** that supports **CRUD operations** for a Bookstore app. It uses **JWT for user authentication**, **UUID for unique IDs**, and **JSON files** for data persistence.

---

### Base URL
[https://bookstore-api-fyhe.onrender.com](https://bookstore-api-fyhe.onrender.com)

---

## 🗂 Project Structure
```
├── config
│   └── env.js               # Environment variables (e.g. secret key)
├── controller
│   ├── booksController.js   # Book-related route handlers
│   └── userController.js    # User-related route handlers
├── router
│   ├── bookRouter.js        # Book routes (CRUD + search)
│   └── userRouter.js        # User routes (register/login)
├── utils
│   ├── utils.js             # Common helpers (e.g. file read/write)
│   ├── booksUtils.js        # Book-specific logic
│   └── userUtils.js         # User-specific logic
├── book.json                # File storing all book data
├── user.json                # File storing all user data
├── index.js                 # Main entry point
├── package.json
└── README.md
```

---

## 🚀 Features

### 🧑 User Authentication
- `POST /register`: Register a new user with email and password.
- `POST /login`: Login and receive a JWT token.
- JWT token is stored in an HTTP cookie.
- All `/books` routes are protected and require a valid token.
- Only the user who added a book can update or delete it.

### 📚 Book Management (Protected Routes)
- `GET /books`: List all books.
- `GET /books/:id`: Get book by ID.
- `POST /books`: Add a new book (auto-generates UUID).
- `PUT /books/:id`: Update a book (only if created by the same user).
- `DELETE /books/:id`: Delete a book (only if created by the same user).
- `GET /books/search?genre=GenreName`: Filter books by genre.
- Pagination support: `GET /books?page=1&limit=5`

### 🧾 Data Persistence
- All user and book data is stored in flat JSON files (`user.json`, `book.json`) using asynchronous `fs.promises`.

### 🛡 Middleware
- Request logger middleware logs all requests with method and path.
- JWT authentication middleware validates token and attaches user info to `req.user`.
- Custom 404 and error handler middleware for graceful error responses.

---

## 🛠 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yashsainani/bookstore-api.git
   cd bookstore-api
   npm install

2. **Setup Environment Variables**
    export const SECRET_KEY = "your_secret_key";
    export const PORT = 5000;

3. **Start the server**
    npm start


## 🧪 Testing Endpoints

1. **User Routes**

    1.1 **Register**
        POST /register
        Body (JSON):
        {
        "email": "user@example.com",
        "password": "123456"
        }

    1.2 **Login**
        POST /login
        Body (JSON):
        {
        "email": "user@example.com",
        "password": "123456"
    }

2. **Books Routes**

    2.1 **Get All Books**
        GET /books

    2.2 **Search by Genre**
        GET /books/search?genre=fantasy

    2.3 **Add a Book**
        POST /books
        Body (JSON):
        {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "genre": "Fantasy",
        "publishedYear": 1937
        }

    2.4 **Update a Book**
        PUT /books/:id
        Body (JSON):
        {
        "title": "The Hobbit: Revised Edition"
        }

    2.5 **Delete a Book**
        DELETE /books/:id