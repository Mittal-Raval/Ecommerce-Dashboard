import categoryModel from "../models/category.js";

export const craeteCategory = async (createData) => {

    return await categoryModel.create({
        categoryName: createData.categoryName
    });
}

export const categoryFindOne = async (createData) => {
    return await categoryModel.findOne(createData);
}
export const getAllCategory = async () => {
    return await categoryModel.find();
}

export const updateCategory = async (query, updateData) => {
    return await categoryModel.findOneAndUpdate(query, updateData);
}

export const deleteCategory = async (categoryId) => {
    return await categoryModel.findOneAndDelete(categoryId);
}
