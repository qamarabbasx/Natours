const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; //regular expression to match inside quotes
  console.log(value);
  const message = `Duplicate field value: ${value}.Please use another value `;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invalid token. Please login  again ', 401);
const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired ! Please login again', 401);
const sendErrorDev = (err, res) => {
  console.log('I,m in send ErrorDev');
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.log('Error 🔥: ', err);
    // 2) send generic mesage
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  console.log(`=========== main error : ${err}`);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    console.log("I'm in development Mode");
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    console.log(`Error======================${JSON.stringify(error)}`);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    else if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    else if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};
