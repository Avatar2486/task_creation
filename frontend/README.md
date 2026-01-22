# Task Management Frontend

React-based frontend for the Task Management API.

## Tech Stack

- React 19
- React Router DOM
- Bootstrap 5
- Axios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
REACT_APP_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm start
```

The app will run on http://localhost:3001

## Features

- User registration and login
- JWT authentication with token storage
- Task management (Create, Read, Update, Delete)
- Task filtering by status
- Task search functionality
- Responsive design with Bootstrap

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── Tasks/
│   │   ├── TaskList.js
│   │   └── TaskForm.js
│   ├── Navbar.js
│   └── PrivateRoute.js
├── context/
│   └── AuthContext.js
├── services/
│   └── api.js
├── App.js
└── index.js
```

## Available Routes

- `/login` - User login
- `/register` - User registration
- `/tasks` - Task list (protected)
- `/tasks/new` - Create new task (protected)
- `/tasks/edit/:id` - Edit task (protected)

## Available Scripts

### `npm start`

Runs the app in development mode.
Open http://localhost:3001 to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.
