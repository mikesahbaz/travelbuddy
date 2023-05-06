import express from 'express';

const router = express.Router();
import { createTrip, getAllTripsByUserId, getTripByTripId, getAllUsersByTripId, deleteTrip} from '../controllers/tripController';

router.post('/create', createTrip);
router.get('/mytrips/:userId', getAllTripsByUserId);
router.get('/trip/:tripId', getTripByTripId);
router.get('/users/:tripId', getAllUsersByTripId);
router.delete('/delete/:tripId', deleteTrip);


export default router;

