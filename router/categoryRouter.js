import express from "express";
import {categoryController} from "../Controller/index.js";
import { authMiddleware } from "../middleware/userAuth.js";

const router = express.Router();

router.post('/create', authMiddleware, categoryController.createCategoryData);
router.get('/get', authMiddleware, categoryController.getAllCategory);
router.get('/:_id', authMiddleware, categoryController.getCategoryById);
router.put('/update-category/:_id', authMiddleware, categoryController.updateCategory);
router.delete('/delete-category/:_id', authMiddleware, categoryController.deleteCategory);

export default router;