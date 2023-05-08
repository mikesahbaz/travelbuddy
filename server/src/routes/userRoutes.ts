import express from 'express';

const router = express.Router();
import {createUser, getAllUsers} from '../controllers/userController';

router.post('/register', createUser);
router.get('/all', getAllUsers);

export default router;
