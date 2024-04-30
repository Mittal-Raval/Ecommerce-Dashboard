import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    imageUrls: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now() },
    updatedAt: { type: Number, default: Date.now() }
},
    { versionKey: false }
);
const imageModel = mongoose.model('productImages', imageSchema);
export default imageModel; 