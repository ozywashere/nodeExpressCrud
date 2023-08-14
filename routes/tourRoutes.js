import express from 'express';
const router = express.Router();

import { getTours, createTour, updateTour, deleteTour, getTour, topTours, tourStats, monthlyPlan } from '../controllers/tourController.js';

router.route('/monthly-plan/:year').get(monthlyPlan);
router.route('/tour-stats').get(tourStats);
router.route('/top-tours').get(topTours, getTours);
router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default router;
