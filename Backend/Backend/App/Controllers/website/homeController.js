const productModel = require("../../Models/productModel");
const sliderModel = require("../../Models/sliderModel");
const whyChooseUsModel = require("../../Models/whyChooseUsModel");
const { sendEmailSafe } = require("../../config/helper");
const { getUploadStaticPath } = require("../../config/controllerUtils");

let productTabs = async (req, res) => {
    try {
        let data = await productModel.find({ status: true })
            .select(['image', 'name', 'price', 'parentCategory'])
            .populate("parentCategory", 'name')
            .sort({ order: 1, date: -1 });
        let staticPath = getUploadStaticPath(req, "product", process.env.PRODUCTIMAGEPATH);
        res.send({ message: "product View", status: 1, staticPath, data });
    } catch (err) {
        res.send({ message: "Error fetching products", status: 0, error: err.message });
    }
};

let slider = async (req, res) => {
    try {
        let data = await sliderModel
            .find({ status: true })
            .select(['title', 'subTitle', 'image', 'link', 'order'])
            .sort({ order: 1, date: -1 });
        let staticPath = getUploadStaticPath(req, "slider", process.env.SLIDERIMAGEPATH);
        res.send({ message: "slider View", status: 1, staticPath, data });
    } catch (err) {
        res.send({ message: "Error fetching sliders", status: 0, error: err.message });
    }
};

let review = async (req, res) => {
    try {
        let data = await whyChooseUsModel.find({ status: true }).select(['title', 'description', 'image', 'order', 'rating']);
        let staticPath = getUploadStaticPath(req, "whychooseus", process.env.WHYCHOOSEUSIMAGEPATH);
        res.send({ message: "whychooseus View", status: 1, staticPath, data });
    } catch (err) {
        res.send({ message: "Error fetching reviews", status: 0, error: err.message });
    }
};

let subscribe = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                status: false,
                message: "Email is required",
            });
        }

        const receiver = process.env.NEWSLETTER_RECEIVER || process.env.OWNER_EMAIL || process.env.ADMINEMAIL || process.env.SMTP_USER;

        // 1. Send notification to owner
        if (receiver) {
            sendEmailSafe({
                to: receiver,
                subject: "New Newsletter Subscription - JGB Trading",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0f3a69;">New Newsletter Subscriber</h2>
                        <p>A new visitor has subscribed to the JGB Trading newsletter.</p>
                        <p><strong>Subscriber Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p style="color: #64748b; font-size: 12px;">Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                `
            });
        }

        // 2. Send thank you confirmation to subscriber
        sendEmailSafe({
            to: email,
            subject: "Thank you for subscribing to JGB Trading!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #0f3a69;">Welcome to JGB Trading Newsletter</h2>
                    <p>Thank you for subscribing to our newsletter. You will be the first to receive updates on our high-quality industrial minerals, desiccants, and special offers.</p>
                    <p style="color: #64748b; font-size: 12px;">Best regards,<br>JGB Trading Team</p>
                </div>
            `
        });

        return res.status(200).json({
            status: true,
            message: "Successfully subscribed",
        });

    } catch (error) {
        console.log("Newsletter SMTP Error:", error);
        return res.status(500).json({
            status: false,
            message: "Unable to subscribe",
            error: error.message
        });
    }
};

module.exports = { productTabs, slider, review, subscribe };
