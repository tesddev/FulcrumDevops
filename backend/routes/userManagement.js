import express from "express";
import { authenticateToken } from "../controllers/auth.js";
import { getAllUsersCount, updatePassword, updateProfile, getUserProfile } from "../controllers/userManagement.js"

const userRouter = express.Router();

userRouter.put('/update-password', authenticateToken, updatePassword);

userRouter.put('/update-profile', authenticateToken, updateProfile);

userRouter.get('/get-all-users-count', authenticateToken, getAllUsersCount);

userRouter.get('/get-user-profile/:_id', authenticateToken, getUserProfile);

export default userRouter;