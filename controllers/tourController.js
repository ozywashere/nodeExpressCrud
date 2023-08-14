import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/cathAsync.js';
import AppError from '../utils/appError.js';

const topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//get all tours
const getTours = catchAsync(async (req, res, next) => {
  //execute query
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
  const tours = await features.query;

  //send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
//create Tour

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//get single tour
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//update tour
const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//delete tour

const deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//
const tourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // take all the tours and group them by difficulty
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      //group by difficulty
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    //unwind deconstructs an array field from the input documents to output a document for each element
    {
      $unwind: {
        path: '$startDates',
        //preserve the document if the path is empty
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      //match the year
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
        },
      },
    },

    {
      //group by month
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        //push the name of the tour into an array
        tours: { $push: '$name' },
      },
    },
    {
      //add a new field
      $addFields: { month: '$_id' },
    },
    {
      //remove the _id field
      $project: {
        _id: 0,
      },
    },
    {
      //sort by the number of tours
      $sort: { numTourStarts: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

export { getTours, createTour, getTour, updateTour, deleteTour, topTours, tourStats, monthlyPlan };
