import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
const topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//get all tours
const getTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
//create Tour

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//get single tour
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//update tour
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//delete tour

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//
const tourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // take all the tours and group them by difficulty
      {
        $match: { ratingsAverage: { $lte: 4.5 } },
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const monthlyPlan = async (req, res) => {
  try {
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
            $lte: new Date(`${year}-12-31`),
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
      {
        //limit the number of results
        $limit: 6,
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export { getTours, createTour, getTour, updateTour, deleteTour, topTours, tourStats, monthlyPlan };
