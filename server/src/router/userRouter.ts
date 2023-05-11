import express from 'express';

const router = express.Router();
import {createUser, getUser, getAllUsers, updateUser, deleteUser} from '../controllers/userController';

router.post('/create', createUser);
router.get('/get/:userId', getUser);
router.get('/get', getAllUsers);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

export default router;
