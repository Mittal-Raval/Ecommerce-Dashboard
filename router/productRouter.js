import express from "express";
import upload from "../middleware/multer.js"
import {productController} from "../Controller/index.js"
import { authMiddleware } from "../middleware/userAuth.js";

const router = express.Router();

router.post('/create', authMiddleware, upload.array('images'), productController.createProduct);
router.get('/get', authMiddleware, productController.getAllProduct);
router.get('/posts', authMiddleware, productController.getProductsWithResponce);
router.get('/:_id', authMiddleware, productController.getProductById);
router.put('/:_id', authMiddleware, productController.updateProduct);
router.delete('/:_id', authMiddleware, productController.deleteProduct);

export default router;