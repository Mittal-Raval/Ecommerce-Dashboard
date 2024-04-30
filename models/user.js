import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
},
  { versionKey: false }
);
const userModel = mongoose.model('userdetails', userSchema);
export default userModel;