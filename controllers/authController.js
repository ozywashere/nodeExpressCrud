import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/cathAsync.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
//sign up

//
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //create token

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  //if everything is ok send token to client
  const token = signToken(user._id);

  //
  if (!token) {
    return next(new AppError('Something went wrong', 500));
  }

  res.status(200).json({
    status: 'success',
    token,
  });
});

//protect routes
const protect = catchAsync(async (req, res, next) => {
  //1) getting token and check if it's there
  if (!req.headers.authorization && !req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }

  //2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //if everything is ok, save to request

  //3) check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does not exist', 401));
  }
  //4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again', 401));
  }
  req.user = currentUser;
  next();
});

export { signup, login, protect };
