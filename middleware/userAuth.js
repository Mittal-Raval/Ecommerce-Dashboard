import jwt from 'jsonwebtoken';
import * as userService from "../Services/userService.js"
import { RequestError, NotFoundError } from '../error/error.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new RequestError("Authorization token missing", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    //console.log(decoded);
    const user = await userService.getUserById(decoded.userId);
    //console.log(user);
    if (!user) {
      throw new NotFoundError("User not found or token invalid");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
export default authMiddleware;