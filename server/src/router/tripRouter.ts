import express from 'express';

const router = express.Router();
import { createTrip, getAllTripsByUserId, getTripByTripId, getAllUsersByTripId, updateTrip, deleteTrip } from '../controllers/tripController';

router.post('/create', createTrip);
router.get('/trip/:tripId', getTripByTripId);
router.get('/mytrips/:userId', getAllTripsByUserId);
router.get('/users/:tripId', getAllUsersByTripId);
router.put('/update/:tripId', updateTrip);
router.delete('/delete/:tripId', deleteTrip);


export default router;

