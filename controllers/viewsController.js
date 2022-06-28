// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res) => {
  // 1- Get All Tours data from the collection
  const tours = await Tour.find();

  // 2-Build template (built overview.pug)
  // 3-Render  that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res) => {
  // 1 Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2 Build the template

  // 3 Render template
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
