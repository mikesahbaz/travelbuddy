import express from 'express';

const router = express.Router();
import { toggleFlightInTrip } from '../controllers/flightController';

router.put('/:tripId/favorite', toggleFlightInTrip);

export default router;
