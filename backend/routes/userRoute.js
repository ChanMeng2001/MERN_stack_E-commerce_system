import express from "express";
import { createUser, loginUser, logoutUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUser, getUserById } from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/')
.post(createUser)
.get(authenticate, authorizeAdmin, getAllUsers);

router.post('/auth', loginUser);

router.post('/logout', logoutUser);

router.route('/profile')
.get(authenticate, getCurrentUserProfile)
.put(authenticate, updateCurrentUserProfile)

router.route('/:id')
.delete(authenticate, authorizeAdmin, deleteUser)
.get(authenticate, authorizeAdmin, getUserById)

export default router;