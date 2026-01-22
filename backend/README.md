# Task Management REST API

A complete RESTful Task Management API built with Node.js, Express, PostgreSQL, JWT authentication, and comprehensive validation.

## Features

- ✅ User authentication (registration, login) with JWT
- ✅ Password encryption using bcrypt
- ✅ Protected routes with JWT middleware
- ✅ Role-based access control (user/admin)
- ✅ Request validation using Joi
- ✅ Centralized error handling
- ✅ Task CRUD operations with ownership
- ✅ Pagination and filtering support
- ✅ Soft delete functionality
- ✅ Search tasks by title
- ✅ Status filtering (pending, in_progress, completed)
- ✅ PostgreSQL database integration
- ✅ Postman collection for API testing

## Tech Stack

- **Node.js** (v16 or above)
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Joi** - Request validation
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16 or above)
- PostgreSQL (v12 or above)
- npm or yarn

## Installation

### 1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables:
Copy `.env.example` to `.env` and update the values:

```env
# Server Configuration
PORT=3000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Node Environment
NODE_ENV=development
```

### 4. Initialize the database:
```bash
# Create database and tables
node createDb.js

# Set up schema and create test users
node setup.js
```

This will:
- Create the `task_management` database
- Create `users` and `tasks` tables
- Set up indexes and triggers
- Create 12 test users (2 admins + 10 regular users)

**Test Users Created:**
- Admin: `admin@example.com` / `admin123`
- Admin: `superadmin@example.com` / `admin123`
- Regular users: `john@example.com`, `jane@example.com`, etc. / `password123`

See `TEST_USERS.md` for complete list of test accounts.

### 5. Reset Database (Optional)
```bash
# Delete all users and tasks (with 3 second warning)
node resetDb.js

# Then recreate test users
node setup.js
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile (Protected)
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Profile (Protected)
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

---

## Task Endpoints (All Protected)

All task endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### 1. Create Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "due_date": "2024-12-31"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "due_date": "2024-12-31T00:00:00.000Z",
    "user_id": 1,
    "is_deleted": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### 2. Get All Tasks (with Pagination)
**GET** `/api/tasks?limit=10&offset=0&status=pending&search=project`

**Query Parameters:**
- `limit` - Number of results per page (default: 10)
- `offset` - Pagination offset (default: 0)
- `status` - Filter by status (optional): pending, in_progress, completed
- `search` - Search by title (optional)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "due_date": "2024-12-31T00:00:00.000Z",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "pages": 5
  }
}
```

### 3. Get Single Task
**GET** `/api/tasks/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "due_date": "2024-12-31T00:00:00.000Z",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Task
**PUT** `/api/tasks/:id`

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "in_progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated title",
    "status": "in_progress",
    ...
  },
  "message": "Task updated successfully"
}
```

### 5. Delete Task
**DELETE** `/api/tasks/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Admin Endpoints (Admin Role Required)

### 1. Get All Users
**GET** `/api/auth/users`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

### 2. Delete User
**DELETE** `/api/auth/users/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

---

## Validation Rules

### User Registration
- `name`: Required, 2-255 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `role`: Optional, must be "user" or "admin"

### Task Creation
- `title`: Required, 1-255 characters
- `description`: Optional, max 5000 characters
- `status`: Optional, must be "pending", "in_progress", or "completed"
- `due_date`: Optional, ISO date format

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Task (with authentication)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "status": "pending",
    "due_date": "2024-12-31"
  }'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Tasks with Filters
```bash
curl "http://localhost:3000/api/tasks?status=pending&limit=5&search=project" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Postman Collection

Import the `postman_collection.json` file into Postman for a complete set of API requests.

The collection includes:
- Automatic token management
- All authentication endpoints
- All task endpoints
- Admin endpoints
- Pre-configured examples

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    due_date TIMESTAMP,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Project Structure

```
backend/
├── config/
│   └── db.js                  # Database connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── taskController.js      # Task business logic
├── database/
│   ├── createDb.js            # Database creation script
│   ├── setup.js               # Schema setup script
│   └── schema.sql             # Database schema
├── middleware/
│   ├── auth.js                # JWT authentication & authorization
│   ├── validation.js          # Joi validation schemas
│   └── errorHandler.js        # Centralized error handling
├── models/
│   ├── userModel.js           # User data model
│   └── taskModel.js           # Task data model
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   └── taskRoutes.js          # Task routes
├── .env                       # Environment variables
├── .env.example               # Example environment variables
├── .gitignore
├── package.json
├── postman_collection.json    # Postman API collection
├── README.md
└── server.js                  # Application entry point
```

---

## Security Features

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ Protected routes requiring authentication
- ✅ Role-based access control
- ✅ Request validation to prevent invalid data
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled for cross-origin requests

---

## Assignment Checklist

### Core Requirements
- ✅ Node.js with Express.js
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ User registration and login
- ✅ Task CRUD operations
- ✅ User-task ownership
- ✅ Pagination support
- ✅ Status filtering
- ✅ Request validation (Joi)
- ✅ Centralized error handling
- ✅ Proper HTTP status codes

### Bonus Features
- ✅ Role-based access control (admin/user)
- ✅ Task search by title
- ✅ Soft delete with is_deleted flag
- ✅ Postman collection
- ✅ Clean modular structure
- ✅ README with setup instructions
- ❌ Unit testing (Jest/Mocha) - Not implemented
- ❌ Swagger/OpenAPI documentation - Not implemented
- ❌ Docker setup - Not implemented

---

## Notes

- All passwords are hashed using bcrypt before storing in the database
- JWT tokens expire after 7 days (configurable in .env)
- Soft delete is implemented (tasks are marked as deleted, not removed)
- All task operations verify ownership (users can only access their own tasks)
- Admin users can access all user management endpoints
- Test users are automatically created during setup (see TEST_USERS.md for complete list)
- Use `resetDb.js` to clear all data and `setup.js` to recreate test users

---

## Environment Variables

Required environment variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in .env
- Check if database exists: `npm run db:create`

### Authentication Issues
- Ensure JWT_SECRET is set in .env
- Token format: `Bearer <token>`
- Check token expiration

### Validation Errors
- Review request body format
- Check required fields
- Verify data types match schema

---

## License

ISC

---

## Support

For issues or questions, please open an issue in the GitHub repository.
