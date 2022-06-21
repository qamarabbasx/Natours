const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// 1) Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// Created our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
console.log(app.get('env'));
// Another middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

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
