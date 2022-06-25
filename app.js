const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// 1) Global Middleware
// set security http headers (always use in express app and always set at the top of middlewares)
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after 1 hour',
});
app.use('/api', limiter);

// Body parser: reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against noSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});
// logs in which development mode we are
console.log(app.get('env'));

// 3) Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3B Middleware Handling all other routes which are not defined in our app
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server ⚠`, 404));
});
// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
