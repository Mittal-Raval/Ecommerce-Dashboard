import userModel from "../models/user.js"

export const createUser = async (userData) => {
    return await userModel.create({
        username: userData.username,
        email: userData.email,
        password: userData.password
    })
}

export const userFindOne = async (userData) => {
    return await userModel.findOne(userData);
}

export const getAllUser = async () => {
    return await userModel.find();
}
export const updateUser = async (query, updateData) => {
    return await userModel.findOneAndUpdate(query, updateData);
};