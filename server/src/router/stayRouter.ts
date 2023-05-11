import express from 'express';

const router = express.Router();
import { toggleStayInTrip } from '../controllers/stayController';

router.put('/:tripId/favorite', toggleStayInTrip);

export default router;