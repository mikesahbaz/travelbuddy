import express from 'express';

const router = express.Router();
import { toggleActivityInTrip } from '../controllers/activityController';

router.put('/:tripId/favorite', toggleActivityInTrip);

export default router;
