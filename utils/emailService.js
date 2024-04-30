import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSCODE
    },
});

export const sendEmail = async (to, subject, text, html, next) => {
    try {
        const info = await transporter.sendMail({
            from: '<ravalmittal6@gmail.com>', // Update with your name and email
            to,
            subject,
            text,
            html,
        });
        return info;
    } catch (error) {
        next(error);
    }
};
