const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const env = require('./config/env');
const logger = require('./utils/logger');
//const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 1. Global middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: logger.stream }));


// Behind Nginx, Render, Railway etc., the real client IP is in a header.
// Without this, EVERY user looks like one IP and shares one limit.
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}





// 2. Routes
//app.use(healthRoutes);
app.use('/api', apiLimiter);                 // limit everything under /api
app.use('/api/v1/auth', authRoutes);
app.get("/",(req,res)=>{
    res.send("<h1>Welcome to ecoomerce API</h1>");
})
app.use('/api/v1/users', userRoutes);

// 3. Error handling (always LAST, and in this order)
app.use(notFound);
app.use(errorHandler);

module.exports = app;