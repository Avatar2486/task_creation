const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
require('dotenv').config(); // load environment variables

const app = express();
const port = process.env.PORT || 3000;

// tried limiting cors to specific origin but had issues
// app.use(cors({ origin: 'http://localhost:3001' }));

// enable cors for all routes
app.use(cors());
app.use(express.json()); // parse json
app.use(express.urlencoded({ extended: true })); // parse url encoded data

// request logging - disabled for now
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// });

// kept this commented out in case we need a welcome route later
// app.get('/', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Welcome to Task Management API',
//         version: '1.0.0',
//         endpoints: {
//             auth: '/api/auth',
//             tasks: '/api/tasks'
//         }
//     });
// });

// api routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// error handling middleware should be at the end
app.use(notFound);
app.use(errorHandler);

// start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
