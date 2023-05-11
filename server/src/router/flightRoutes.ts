import express from 'express';

const router = express.Router();
import { addFavoriteFlightToTrip } from '../controllers/flightController';

router.post('/:tripId/favorite', addFavoriteFlightToTrip);

export default router;
