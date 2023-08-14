import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tourSchema = new Schema({
   _id:String,
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Please enter your durations'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Please enter your maxGroupSize'],
  },
  difficulty: {
    type: String,
    required: [true, 'Please enter your difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Please enter your price'],
  },

  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;