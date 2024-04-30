import {productService} from "../Services/index.js";
import { paginationAndSorting } from "../utils/Service.js";
import { searching } from "../utils/Service.js";
import { paginatedResponce } from "../utils/Service.js";
import { handleResponse } from "../utils/Service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";

export const createProduct = async (req, res, next) => {
    try {
        const files = req.files; // Access the uploaded files (multiple images)
        if (!files || files.length === 0) {
            throw new BadRequestError("No images uploaded");
        }

        const { productName, description, price, quantity, isActive, isDeleted, category } = req.body;
        console.log(req.body);
        const checkProduct = await productService.findProduct({ productName: productName });

        if (checkProduct) {
            throw new BadRequestError("Product already exists");
        }

        const imageUrls = files.map(file => 'uploads/' + file.filename);
        const productdata = {
            productName,
            description,
            price,
            quantity,
            isActive,
            isDeleted
        };

        const product = await productService.createProduct(productdata);
        await productService.saveImageUrls(product._id, imageUrls);

        const categories = Array.isArray(category) ? category : [category];
        await productService.createProductCategoryRelations(product._id, categories);
        return handleResponse(res, 200, "Product created successfully");
    } catch (error) {
        next(error);
    }
};

export const getAllProduct = async (req, res, next) => {
    try {
        const data = await productService.getAllProducts();
        return handleResponse(res, 200, "Products fetched successfully", data);
    } catch (error) {
        next(error)
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const productId = await productService.findProduct({_id:id});
        if (!productId) {
            throw new NotFoundError("Product not found");
        }
        return handleResponse(res, 200, "Product fetched successfully", productId);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const query = { _id: req.params._id };
        const updateData = req.body;
        const pdata = await productService.updateProduct(query,updateData);
        if (!pdata) {
            throw new NotFoundError("Product not found");
        }
        return handleResponse(res, 200, "Product updated successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const query = { _id: req.params._id };
        const productId = await productService.deleteProduct(query);
        if (!productId) {
            throw new NotFoundError("Product not found");
        }
        return handleResponse(res, 200, "Product deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const getProductsWithResponce = async (req, res, next) => {
    try {
        const pgAndSort = req.query;
        const searchFilter = req.query.searchFilter || '';
        const fields = ["productName", "description", "productCatlogRelation.categoryName"];

        const productSorting = await paginationAndSorting(pgAndSort);

        const { page, perPage } = productSorting;


        const productSearching = await searching(searchFilter, fields);
        console.log("Product Searching:", JSON.stringify(productSearching));

        const list = await productService.getProductsWithResponce(productSorting, productSearching);
        console.log("Product List:", JSON.stringify(list));

        const totalRecords = await productService.paginationAggregation(productSearching);
        console.log(totalRecords);

        const totalCount = await paginatedResponce(page, perPage, totalRecords, list);
        const data = totalCount;
        console.log(data);
        return handleResponse(res, 200, "Products fetched successfully", data);

    } catch (error) {
        next(error);
    }
}