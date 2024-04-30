import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: Date.now() }

},
    { versionKey: false }
);
const categoryModel = mongoose.model('Category', categorySchema);
export default categoryModel;