import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() }
  //category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
},
  { versionKey: false }
);
const productModel = mongoose.model('products', productSchema);
export default productModel;
