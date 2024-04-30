import mongoose from "mongoose";
const dbConnect = async (req, res, next) => {
    return await mongoose.connect(process.env.DB_URL).then(() => {
        console.log("database connect suucessfully");
    })
        .catch((err) => {
            console.log(`Database err: ${err}`);
        })
}
export default dbConnect;    