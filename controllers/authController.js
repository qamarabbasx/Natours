/* eslint-disable no-unused-expressions */
/* eslint-disable no-unreachable */
/* eslint-disable arrow-body-style */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password !', 400));
  }
  // check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or Password is incorrect', 401));
  }
  // if everything okay send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  // 1- Getting token and check if it's still there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not Logged In! Please log in to get access. ', 401)
    );
  }

  // 2- Token Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3 Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  // 4 check if user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again. ', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin','lead-guide']. role=user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1- Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/forgotPassword/${resetToken}`;
  const message = `Forgot your password ? submit a PATCH request with your new pasword and your password confirm to: ${resetURL}.\nIf you didn't forgot your password ignore this email!`;
  try {
    console.log('this is try:', resetURL, message);
    await sendEmail({
      email: user.email,
      subject: 'Your  password reset token valid for 10 minutes',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was error sending email. Try again later'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {});
