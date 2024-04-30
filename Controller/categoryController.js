import {categoryService} from "../Services/index.js";
import { handleResponse } from "../utils/Service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";

export const createCategoryData = async (req, res, next) => {
    try {
        const { categoryName } = req.body;
        const chekCategory = await categoryService.categoryFindOne({ categoryName: categoryName })

        if (chekCategory) {
            throw new BadRequestError("Category already exists");
        }
        await categoryService.craeteCategory(req.body);

        return handleResponse(res, 200, "Category created successfully");
    } catch (error) {
        next(error);
    }
};

export const getAllCategory = async (req, res, next) => {
    try {
        const category = await categoryService.getAllCategory();
        return handleResponse(res, 200, "Categories fetched successfully", category);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const id = req.params._id;
        const category = await categoryService.categoryFindOne({_id:id});
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return handleResponse(res, 200, "Category fetched successfully", category);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const query = { _id: req.params._id };
        const updateData = req.body;
        const category = await categoryService.updateCategory(query, updateData);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return handleResponse(res, 200, "Category updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const query = { _id: req.params._id };
        const category = await categoryService.deleteCategory(query);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return handleResponse(res, 200, "Category deleted successfully");
    } catch (error) {
        next(error);
    }
};

