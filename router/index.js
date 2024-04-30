import userRouter from "./userRouter.js";
import categoryRouter from "./categoryRouter.js";
import productRouter from "./productRouter.js";
import express from "express";

const router = express.Router();

router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/products', productRouter);

export default router;