import express from 'express';

const router = express.Router();
import { createTrip, getTripByTripId, getAllTripsByUserId, getAllTripsByUserEmail, getAllUsersByTripId, updateTrip, deleteTrip } from '../controllers/tripController';

router.post('/create', createTrip);
router.get('/trip/:tripId', getTripByTripId);
router.get('/tripsbyuserid/:userId', getAllTripsByUserId);
router.get('/mytrips/:firebaseEmail', getAllTripsByUserEmail);
router.get('/users/:tripId', getAllUsersByTripId);
router.put('/update/:tripId', updateTrip);
router.delete('/delete/:tripId', deleteTrip);


export default router;

