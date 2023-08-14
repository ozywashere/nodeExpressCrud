import express from 'express';
const router = express.Router();

import { getTours, createTour, updateTour, deleteTour, getTour } from '../controllers/tourController.js';

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

export default router;
