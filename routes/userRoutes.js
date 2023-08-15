import express from 'express';
import { signup, login, protect } from '../controllers/authController.js';
import { getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
