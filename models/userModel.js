const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],

      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This validator only works on Create and Save !!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same !',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.pre('save', async function (next) {
  // Only runs this function if the password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12 // cost is cpu intensive greater the value more it will be cpu intensive
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword feild from database to persist
  this.confirmPassword = undefined;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
