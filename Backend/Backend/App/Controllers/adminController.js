const bcrypt = require('bcrypt');
let jwt = require("jsonwebtoken");
const { sendEmailSafe } = require('../config/helper');
const adminModel = require('../Models/adminModel');
const saltRounds = 10;

let login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = String(email || "").trim().toLowerCase();
        if (!email || !password) {
            return res.status(400).send({ status: 0, message: "Email and password are required" });
        }

        let checkEmailInDB = await adminModel.findOne({ email }).select("+password");
        if (checkEmailInDB) {
            let dbPassword = checkEmailInDB.password;
            let checkPassword = await bcrypt.compare(password, dbPassword);
            if (checkPassword) {
                let token = jwt.sign(
                    { id: checkEmailInDB._id },
                    process.env.TOKENKEY,
                    { expiresIn: "12h" }
                );
                const adminData = checkEmailInDB.toObject();
                delete adminData.password;
                delete adminData.__v;
                return res.send({
                    status: 1,
                    message: "Login successfully",
                    data: adminData,
                    token
                });
            } else {
                return res.status(401).send({ status: 0, message: "Password is incorrect" });
            }
        } else {
            return res.status(401).send({ status: 0, message: "Email not found" });
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Login error" });
    }
};

let adforgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        let emailCheck = await adminModel.findOne({ email });
        if (emailCheck) {
            let resetToken = jwt.sign(
                { id: emailCheck._id, purpose: "admin-password-reset" },
                process.env.TOKENKEY,
                { expiresIn: "15m" }
            );
            let adminAppUrl = process.env.ADMINAPPURL || process.env.APPURL || "http://localhost:5173";
            let resetUrl = `${adminAppUrl}/reset-password/${emailCheck._id}?token=${resetToken}`;

            await sendEmailSafe({
                to: emailCheck.email,
                subject: 'JGB Trading Admin | Password Reset Request',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0f3a69;">Admin Password Reset Request</h2>
                        <p>Dear <strong>${emailCheck.name || 'Admin'}</strong>,</p>
                        <p>You have requested to reset your admin portal password. Click the button below to proceed:</p>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="${resetUrl}" style="background-color: #0f3a69; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="color: #64748b; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
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

let adresetPassword = async (req, res) => {
    try {
        let { id } = req.params;
        let { newPassword, confirmPassword, token } = req.body;

        if (!token) {
            return res.status(401).send({ status: 0, message: "Password reset token is required" });
        }

        const decoded = jwt.verify(token, process.env.TOKENKEY);
        if (decoded.id !== id || decoded.purpose !== "admin-password-reset") {
            return res.status(401).send({ status: 0, message: "Password reset link is invalid" });
        }

        if (String(newPassword || "").length < 8) {
            return res.status(400).send({ status: 0, message: "Password must be at least 8 characters" });
        }

        if (newPassword === confirmPassword) {
            let hashPassword = await bcrypt.hash(newPassword, saltRounds);
            await adminModel.updateOne(
                { _id: id },
                { $set: { password: hashPassword } }
            );
            return res.send({ status: 1, message: "Password changed successfully" });
        } else {
            return res.status(400).send({ status: 0, message: "New password and confirm Password do not match" });
        }
    } catch (err) {
        return res.status(401).send({ status: 0, message: "Password reset link is invalid or expired" });
    }
};

let adupdateProfile = async (req, res) => {
    try {
        let { address, phone, name, email, mapUrl, facebook, instagram, youtube } = req.body;
        let authHeader = req.headers.authorization;
        if (!authHeader) return res.send({ status: 0, message: "Authorization token required" });

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;

        let updateObj = {
            address,
            phone,
            name,
            email,
            mapUrl,
            facebook,
            instagram,
            youtube
        };

        if (req.file && req.file.filename) {
            updateObj['image'] = req.file.filename;
        }

        await adminModel.updateOne({ _id: id }, { $set: updateObj });
        res.send({ status: 1, message: "Profile updated successfully" });
    } catch (err) {
        res.send({ status: 0, message: "Error updating profile", error: err.message });
    }
};

let adgetProfile = async (req, res) => {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader) return res.send({ status: 0, message: "Authorization token required" });

        let token = authHeader.split(" ")[1] || authHeader;
        let decoded = jwt.verify(token, process.env.TOKENKEY);
        let { id } = decoded;

        let adminData = await adminModel.findOne({ _id: id }).select("-password");
        if (!adminData) {
            res.send({ status: 0, message: "Admin not found" });
        } else {
            res.send({
                status: 1,
                message: "Profile fetched successfully",
                data: adminData,
                imagePath: process.env.ADMINIMAGEPATH || "http://localhost:8000/uploads/admin/"
            });
        }
    } catch (error) {
        res.send({ status: 0, message: "Error fetching profile", error: error.message });
    }
};

module.exports = { login, adforgotPassword, adresetPassword, adgetProfile, adupdateProfile };
