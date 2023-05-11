import express from 'express';

const router = express.Router();
import { addFavoriteAirbnbToTrip } from '../controllers/airbnbController';

router.post('/:tripId/favorite', addFavoriteAirbnbToTrip);

export default router;