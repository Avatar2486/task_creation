# Task Handling System

A full-stack web application for managing tasks with user authentication. Built with Node.js/Express backend and React frontend.

## Features

- User registration and login
- Create, read, update, and delete tasks
- Secure authentication with JWT tokens
- Responsive frontend interface

## Tech Stack

- **Backend**: Node.js, Express.js, SQLite, JWT
- **Frontend**: React, Axios

## Project Structure

- `backend/`: Server-side code, API routes, database models
- `frontend/`: Client-side React application
- `postman_collection.json`: API testing collection

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. 1. Create the database:
   ```
   node createDb.js
   ```

3. 2. Set up the database:
   ```
   node setup.js
   ```

4. Start the server:
   ```
   npm start
   ```

The backend will run on `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend will run on `http://localhost:3001`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (authenticated)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Testing

Use the provided `postman_collection.json` to test the API endpoints.
