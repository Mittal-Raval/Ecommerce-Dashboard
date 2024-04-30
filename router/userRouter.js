import express from "express";
import { userController } from "../Controller/index.js";
import { authMiddleware } from "../middleware/userAuth.js";

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/sendotp", userController.sendOtp);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/update-user/:_id",userController.updateUser);
router.get("/:_id", authMiddleware, userController.getUserById);
router.get("/get", authMiddleware, userController.getAllUsers);


export default router;
