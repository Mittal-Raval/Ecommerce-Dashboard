import mongoose from "mongoose";

const productCategoryRelationSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
},
{ versionKey: false });

const ProductCategoryRelationModel = mongoose.model('productcategoryrelation', productCategoryRelationSchema);

export default ProductCategoryRelationModel;
