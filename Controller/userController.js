import {userService} from "../Services/index.js"
import jwt from "jsonwebtoken";
import twilio from 'twilio';
import { handleResponse } from "../utils/Service.js";
import { BadRequestError, NotFoundError } from "../error/error.js";
import { sendEmail } from "../utils/emailService.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const chekUser = await userService.userFindOne({ email: email })

    if (chekUser) { 
      throw new BadRequestError('User already exists');
    }
    await userService.createUser(req.body);
    return handleResponse(res, 201, "User created successfully");

  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userService.userFindOne({ email: email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.password !== password) {
      throw new BadRequestError('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });
    return handleResponse(res, 200, "Login successful", { token });
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const user = await userService.getAllUser();
    return handleResponse(res, 200, "Users fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const id = req.params._id;
    const user = await userService.userFindOne({_id:id});
    console.log(user);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

// export const updateUser = async (req, res, next) => {
//   try {
//       const query = { _id: req.params._id }; 
//       const updateData = req.body.toLowerCase(); 
//       const existingUser = await userService.userFindOne({_id:query});

//       if (!existingUser) {
//         throw new NotFoundError("User not found");
//       }
//       const userWithSameEmail = await userService.userFindOne({ email: updateData });

//       // if (userWithSameEmail && userWithSameEmail._id.toString() !== query) {
//       //   throw new BadRequestError("Email already exists for another user");
//       // }

//       if (existingUser.email.toLowerCase() !== updateData) {
//         existingUser.email = updateData;
//         await existingUser.save();
//       }

//       return handleResponse(res, 200, "User email updated successfully", existingUser);
  
//       // const updatedUser = await userService.updateUser(query, updateData);
//       // return handleResponse(res, 200, "User updated successfully");
//   } catch (error) {
//       next(error);
//   }
// };






export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params._id;
    const newEmail = req.body.email.toLowerCase(); // Convert new email to lowercase for case insensitivity
    const existingUser = await userService.userFindOne({_id:userId});

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    // Check if the new email is different from the existing email
    if (existingUser.email.toLowerCase() !== newEmail) {
      // Check if the new email is already associated with another user
      const userWithSameEmail = await userService.userFindOne({ email: newEmail });
      if (userWithSameEmail && userWithSameEmail._id.toString() !== userId) {
        throw new BadRequestError("Email already exists for another user");
      }

      // Update the user's email only if it's different from the existing email
      existingUser.email = newEmail;
      await existingUser.save();
    }

    return handleResponse(res, 200, "User email updated successfully", existingUser);
  } catch (error) {
    next(error);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("You can not send email");
    }
    const user = await userService.userFindOne({ email: email })

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const token = jwt.sign({ userId: user._id, email }, process.env.SECRETKEY, { expiresIn: '1h' });

    const to = "mittal.igenerate@gmail.com";
    const subject = "Hello ✔";
    const text = "hy bro!";
    const html = '<p>http://localhost:3000/user/auth/' + token + '</p>';

    const emailData = await sendEmail(to, subject, text, html);
    return handleResponse(res, 200, "emial sent successfully:", emailData)
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;

    if (!token || !password) {
      throw new BadRequestError("Token or newPassword missing");
    }


    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const { userId, email } = decoded;

    const user = await userService.userFindOne({userId});

    if (!user || user.email !== email) {
      throw new NotFoundError("User not found");
    }

    user.password = password;
    await user.save();
    return handleResponse(res, 200, "Password updated successfully");

  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const message = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: process.env.RECEIVER_NUMBER, channel: 'sms' });

    console.log("please enter otp");
    return handleResponse(res, 200, 'OTP sent successfully', message);
  } catch (error) {
    next(error);
  }
};


export const verifyOtp = async (req, res, next) => {
  console.log(req.body.otp);
  try {
    const isOTP = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({
      to: `+91${req.body.mobileNumber}`,
      code: req.body.otp
    })

    if (!isOTP) {
      throw new NotFoundError("otp not found");
    }
    const token = jwt.sign({ id: process.env.TWILIO_SERVICE_SID }, process.env.SECRETKEY, { expiresIn: '1h' });
    return handleResponse(res, 200, "Mobile number verified", token);
  } catch (error) {
    next(error);
  }
}
