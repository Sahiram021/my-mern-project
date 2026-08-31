const { sendEmailSafe, getWelcomeEmailHtml, getNewUserAlertHtml } = require("../../config/helper");
const userModel = require("../../Models/userModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
let jwt = require('jsonwebtoken');

let register = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.send({ message: "Name, email, and password are required", status: 0 });
        }

        if (password.length < 6) {
            return res.send({ message: "Password must be at least 6 characters long", status: 0 });
        }

        let checkEmail = await userModel.findOne({ email });
        if (checkEmail) {
            return res.send({ message: "Email already exist", status: 0 });
        }

        let hashPassword = bcrypt.hashSync(password, saltRounds);

        let insertRes = await userModel.create({
            name,
            email,
            password: hashPassword
        });

        let token = jwt.sign({ id: insertRes._id }, process.env.TOKENKEY || "12345");

        // 1. Send Welcome Email to User (asynchronous, non-blocking)
        sendEmailSafe({
            to: email,
            subject: "Welcome to JGB Trading - Registration Successful",
            html: getWelcomeEmailHtml(name, email)
        });

        // 2. Send New User Alert to Owner / Admin (asynchronous, non-blocking)
        const ownerEmail = process.env.OWNER_EMAIL || process.env.ADMINEMAIL || process.env.SMTP_USER;
        if (ownerEmail) {
            sendEmailSafe({
                to: ownerEmail,
                subject: `New User Registered: ${name}`,
                html: getNewUserAlertHtml({ name, email })
            });
        }

        res.send({
            message: "Register successfully",
            status: 1,
            insertRes,
            token
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.send({ message: "Error occurred during registration", status: 0, error: err.message });
    }
};

let login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let checkEmail = await userModel.findOne({ email });
        if (!checkEmail) {
            return res.send({ status: 0, message: "Email not found" });
        }

        let dbPassword = checkEmail.password;
        let checkPassword = await bcrypt.compare(password, dbPassword);
        if (checkPassword) {
            let token = jwt.sign({ id: checkEmail._id }, process.env.TOKENKEY || "12345");
            res.send({
                status: 1,
                message: "Login successfully",
                data: checkEmail,
                token
            });
        } else {
            res.send({ status: 0, message: "Password is incorrect" });
        }
    } catch (err) {
        res.send({ status: 0, message: "Login error", error: err.message });
    }
};

let changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword, confirmPassword } = req.body;
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.send({ status: 0, message: "Authorization token required" });

        let decoded = jwt.verify(token, process.env.TOKENKEY || "12345");
        let { id } = decoded;
        let userData = await userModel.findOne({ _id: id });
        if (!userData) return res.send({ status: 0, message: "User not found" });

        let dbPassword = userData.password;
        let checkPassword = bcrypt.compareSync(oldPassword, dbPassword);
        if (checkPassword) {
            if (newPassword === confirmPassword) {
                let hashPassword = bcrypt.hashSync(newPassword, saltRounds);
                await userModel.updateOne(
                    { _id: id },
                    { $set: { password: hashPassword } }
                );
                res.send({ status: 1, message: "Password changed successfully" });
            } else {
                res.send({ status: 0, message: "New password and confirm Password do not match" });
            }
        } else {
            res.send({ status: 0, message: "Invalid old password" });
        }
    } catch (err) {
        res.send({ status: 0, message: "Error changing password", error: err.message });
    }
};

let updateProfile = async (req, res) => {
    try {
        let { address, phone, name } = req.body;
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.send({ status: 0, message: "Authorization token required" });

        let decoded = jwt.verify(token, process.env.TOKENKEY || "12345");
        let { id } = decoded;
        let updateObj = { address, phone, name };
        if (req.file && req.file.filename) {
            updateObj['image'] = req.file.filename;
        }
        await userModel.updateOne({ _id: id }, { $set: updateObj });
        res.send({ status: 1, message: "Profile updated successfully" });
    } catch (err) {
        res.send({ status: 0, message: "Error updating profile", error: err.message });
    }
};

let getProfile = async (req, res) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.send({ status: 0, message: "Authorization token required" });

        let decoded = jwt.verify(token, process.env.TOKENKEY || "12345");
        let { id } = decoded;
        let userData = await userModel.findOne({ _id: id });
        if (!userData) {
            res.send({ status: 0, message: "User not found" });
        } else {
            res.send({
                status: 1,
                message: "Profile fetched successfully",
                data: userData,
                imagePath: process.env.USERIMAGEPATH || "http://localhost:8000/uploads/user/"
            });
        }
    } catch (error) {
        res.send({ status: 0, message: "Error fetching profile", error: error.message });
    }
};

let forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        let emailCheck = await userModel.findOne({ email });
        if (emailCheck) {
            let resetToken = jwt.sign({ id: emailCheck._id }, process.env.TOKENKEY || "12345");
            let resetUrl = `${process.env.APPURL || 'http://localhost:3000'}/reset-password/${emailCheck._id}?token=${resetToken}`;
            
            await sendEmailSafe({
                to: emailCheck.email,
                subject: 'JGB Trading | Password Reset Request',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0f3a69;">Password Reset Request</h2>
                        <p>Dear <strong>${emailCheck.name}</strong>,</p>
                        <p>You have requested to reset your password for your JGB Trading account. Click the button below to proceed:</p>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="${resetUrl}" style="background-color: #0f3a69; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #64748b; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
                    </div>
                `
            });
            res.send({ message: "Password reset email sent", status: 1 });
        } else {
            res.send({ message: "Email Not Found", status: 0 });
        }
    } catch (err) {
        res.send({ message: "Error sending reset email", status: 0, error: err.message });
    }
};

let resetPassword = async (req, res) => {
    try {
        let { id } = req.params;
        let { newPassword, confirmPassword } = req.body;

        if (newPassword === confirmPassword) {
            let hashPassword = bcrypt.hashSync(newPassword, saltRounds);
            await userModel.updateOne(
                { _id: id },
                { $set: { password: hashPassword } }
            );
            res.send({ status: 1, message: "Password changed successfully" });
        } else {
            res.send({ status: 0, message: "New password and confirm Password do not match" });
        }
    } catch (err) {
        res.send({ status: 0, message: "Error resetting password", error: err.message });
    }
};

module.exports = { register, login, changePassword, updateProfile, getProfile, forgotPassword, resetPassword };
