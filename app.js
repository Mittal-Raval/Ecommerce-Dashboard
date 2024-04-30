import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/connection.js";
import route from "./router/index.js";
import path from "path";
import { handleErrorResponse } from "./error/errorhandler.js";

const app = express();
dotenv.config();
dbConnect();

app.use('/uploads', express.static(path.join("uploads")));
app.use(express.json());
app.use('/e-com', route);
app.use(handleErrorResponse);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});