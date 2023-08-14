import express from 'express';
const router = express.Router();

import { getTours, createTour, updateTour, deleteTour, getTour, topTours } from '../controllers/tourController.js';

router.route('/top-tours').get(topTours, getTours);
router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default router;
