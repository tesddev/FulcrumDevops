import express from "express";
import { isAdmin, deleteUser, getAllUsers, editUser, createUser } from "../controllers/admin.js"
import { authenticateToken } from "../controllers/auth.js";

const adminRouter = express.Router();

adminRouter.delete('/users/:_id', authenticateToken, isAdmin, deleteUser);

adminRouter.get('/get-all-users', authenticateToken, isAdmin, getAllUsers);

adminRouter.post('/create-user', authenticateToken, isAdmin, createUser);

adminRouter.put('/edit-user/:_id', authenticateToken, isAdmin, editUser);

export default adminRouter;