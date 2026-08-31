const slugify = require('slugify');
const nodemailer = require("nodemailer");
require("dotenv").config();

let createSlug = (name) => {
    return slugify(name || '', {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true
    });
};

const getTransporter = () => {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || "jgb635860@gmail.com";
    const rawPass = process.env.SMTP_PASS || "rzyjmqzfhsqfhwyz";
    const pass = rawPass ? rawPass.replace(/\s+/g, "") : "rzyjmqzfhsqfhwyz";

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

const transporter = getTransporter();

/**
 * Safe email sending function that never throws uncaught exceptions
 * Ensures website operations never stop or fail due to SMTP issues
 */
const sendEmailSafe = async ({ to, subject, html, text, from }) => {
    if (!to) {
        console.warn("[Email Safe] Skipped: No recipient provided");
        return { success: false, error: "No recipient provided" };
    }

    const defaultSender = `"JGB Trading" <${process.env.SMTP_USER || 'jgb635860@gmail.com'}>`;
    const mailOptions = {
        from: from || defaultSender,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: subject || "Notification from JGB Trading",
        text: text || "",
        html: html || ""
    };

    try {
        const mailer = getTransporter();
        const info = await mailer.sendMail(mailOptions);
        console.log(`[Email SUCCESS] Sent to: ${mailOptions.to} | Subject: "${mailOptions.subject}" | ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[Email ERROR] Failed to send to: ${mailOptions.to} | Subject: "${mailOptions.subject}" | Error:`, error.message);
        return { success: false, error: error.message };
    }
};

// =========================================================================
// EMAIL TEMPLATES
// =========================================================================

/**
 * 1. User Welcome Email Template
 */
const getWelcomeEmailHtml = (name, email) => {
    const appUrl = process.env.APPURL || "http://localhost:3000";
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to JGB Trading</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f3a69 0%, #1e5ba0 100%); padding:32px 24px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:0.5px;">JGB Trading Private Limited</h1>
                            <p style="margin:6px 0 0; color:#e0e7ff; font-size:14px;">High Quality Industrial Minerals & Desiccant Powders</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 32px; color:#334155;">
                            <h2 style="margin:0 0 16px; color:#0f172a; font-size:22px; font-weight:700;">Welcome, ${name || 'Valued Customer'}! </h2>
                            <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">Thank you for registering with <strong>JGB Trading</strong>. We are thrilled to have you as part of our community.</p>
                            <p style="margin:0 0 20px; color:#475569; font-size:15px; line-height:1.6;">Your registered email address is: <strong style="color:#0f3a69;">${email}</strong></p>
                            
                            <div style="background-color:#f8fafc; border-left:4px solid #0f3a69; padding:16px 20px; border-radius:4px; margin:24px 0;">
                                <h3 style="margin:0 0 8px; color:#0f172a; font-size:15px; font-weight:600;">What you can do next:</h3>
                                <ul style="margin:0; padding-left:20px; color:#475569; font-size:14px; line-height:1.7;">
                                    <li>Explore our industrial mineral powders & anti-moisture products.</li>
                                    <li>Add items to your cart & wishlist.</li>
                                    <li>Place orders seamlessly with fast tracking.</li>
                                </ul>
                            </div>

                            <div style="text-align:center; margin:32px 0 16px;">
                                <a href="${appUrl}" style="background-color:#0f3a69; color:#ffffff; text-decoration:none; padding:12px 30px; border-radius:6px; font-weight:600; font-size:15px; display:inline-block; box-shadow:0 2px 6px rgba(15,58,105,0.3);">Visit Store</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f8fafc; padding:20px 32px; text-align:center; border-top:1px solid #e2e8f0; color:#64748b; font-size:13px;">
                            <p style="margin:0 0 6px;">Need assistance? Reach out to our support team at <a href="mailto:${process.env.SMTP_USER || 'jgb635860@gmail.com'}" style="color:#0f3a69; text-decoration:none; font-weight:600;">${process.env.SMTP_USER || 'jgb635860@gmail.com'}</a></p>
                            <p style="margin:0;">&copy; ${new Date().getFullYear()} JGB Trading Private Limited. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * 2. Owner Alert: New User Registered
 */
const getNewUserAlertHtml = (userData) => {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New User Registration</title></head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; border:1px solid #e2e8f0; overflow:hidden;">
                    <tr>
                        <td style="background:#1e293b; padding:20px 28px; color:#ffffff;">
                            <h2 style="margin:0; font-size:20px;"> New User Registration Alert</h2>
                            <p style="margin:4px 0 0; color:#94a3b8; font-size:13px;">A new customer has created an account on JGB Trading</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                    <td style="font-weight:bold; color:#475569; width:140px;">Customer Name:</td>
                                    <td style="color:#0f172a; font-weight:600;">${userData.name || 'N/A'}</td>
                                </tr>
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td style="font-weight:bold; color:#475569;">Email Address:</td>
                                    <td style="color:#2563eb;"><a href="mailto:${userData.email}">${userData.email || 'N/A'}</a></td>
                                </tr>
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                    <td style="font-weight:bold; color:#475569;">Phone:</td>
                                    <td style="color:#0f172a;">${userData.phone || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:bold; color:#475569;">Registration Date:</td>
                                    <td style="color:#0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * 3. Customer Order Confirmation Email
 */
const getOrderConfirmationHtml = (orderData, userDetails = {}) => {
    const items = orderData.items || [];
    const shipping = orderData.shippingAddress || {};
    const orderId = orderData._id ? orderData._id.toString() : (orderData.razorpayOrderId || "N/A");
    const totalAmount = orderData.totalAmount || 0;
    const paymentMethod = (orderData.paymentMethod || "COD").toUpperCase();

    let itemsRows = items.map((item, index) => {
        const title = item.title || item.name || item.productName || "Product";
        const price = item.price || item.productPrice || 0;
        const qty = item.qty || item.quantity || 1;
        const itemTotal = price * qty;
        return `
        <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:12px; color:#334155; font-size:14px;">${index + 1}. <strong>${title}</strong></td>
            <td style="padding:12px; text-align:center; color:#475569; font-size:14px;">${qty}</td>
            <td style="padding:12px; text-align:right; color:#475569; font-size:14px;">₹${price}</td>
            <td style="padding:12px; text-align:right; color:#0f172a; font-weight:600; font-size:14px;">₹${itemTotal}</td>
        </tr>`;
    }).join("");

    if (items.length === 0) {
        itemsRows = `<tr><td colspan="4" style="padding:16px; text-align:center; color:#64748b;">Order details processed</td></tr>`;
    }

    const customerName = shipping.name || shipping.firstName ? `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() : (userDetails.name || 'Valued Customer');
    const customerAddress = [
        shipping.address || shipping.street,
        shipping.city,
        shipping.state,
        shipping.pincode || shipping.postalCode,
        shipping.country
    ].filter(Boolean).join(", ");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Confirmed</title></head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
        <tr>
            <td align="center">
                <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 4px 15px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding:28px 24px; text-align:center; color:#ffffff;">
                            <h1 style="margin:0; font-size:24px; font-weight:700;">🎉 Order Confirmed!</h1>
                            <p style="margin:6px 0 0; font-size:14px; color:#d1fae5;">Thank you for shopping with JGB Trading</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;">
                            <p style="margin:0 0 16px; color:#334155; font-size:16px;">Hello <strong>${customerName}</strong>,</p>
                            <p style="margin:0 0 20px; color:#475569; font-size:14px; line-height:1.6;">Your order has been successfully placed and is now being processed. Below are your order summary and delivery details:</p>

                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:24px;">
                                <table width="100%" style="font-size:14px; color:#334155;">
                                    <tr>
                                        <td><strong>Order ID:</strong> #${orderId}</td>
                                        <td style="text-align:right;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Payment Mode:</strong> ${paymentMethod}</td>
                                        <td style="text-align:right;"><strong>Status:</strong> <span style="color:#059669; font-weight:600;">Processing</span></td>
                                    </tr>
                                </table>
                            </div>

                            <h3 style="margin:0 0 12px; color:#0f172a; font-size:16px;">Ordered Items</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; border-collapse:collapse; margin-bottom:20px;">
                                <thead>
                                    <tr style="background:#f1f5f9; color:#475569; font-size:13px; text-align:left;">
                                        <th style="padding:10px 12px;">Item</th>
                                        <th style="padding:10px 12px; text-align:center;">Qty</th>
                                        <th style="padding:10px 12px; text-align:right;">Price</th>
                                        <th style="padding:10px 12px; text-align:right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsRows}
                                    <tr style="background:#f8fafc; font-weight:bold;">
                                        <td colspan="3" style="padding:12px; text-align:right; color:#0f172a; font-size:15px;">Grand Total:</td>
                                        <td style="padding:12px; text-align:right; color:#059669; font-size:16px;">₹${totalAmount}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 style="margin:0 0 8px; color:#0f172a; font-size:16px;">Delivery Address</h3>
                            <p style="margin:0 0 24px; background:#f8fafc; border:1px solid #e2e8f0; padding:14px; border-radius:8px; color:#475569; font-size:14px; line-height:1.5;">
                                <strong>${customerName}</strong><br>
                                ${customerAddress || 'Address on file'}<br>
                                Phone: ${shipping.phone || userDetails.phone || 'N/A'}
                            </p>

                            <p style="margin:0; color:#64748b; font-size:13px; text-align:center;">If you have any questions regarding this order, please contact our support team at ${process.env.SMTP_USER || 'jgb635860@gmail.com'}.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc; padding:16px; text-align:center; border-top:1px solid #e2e8f0; color:#64748b; font-size:12px;">
                            &copy; ${new Date().getFullYear()} JGB Trading Private Limited.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * 4. Owner Alert: New Order Received
 */
const getNewOrderAlertHtml = (orderData, userDetails = {}) => {
    const items = orderData.items || [];
    const shipping = orderData.shippingAddress || {};
    const orderId = orderData._id ? orderData._id.toString() : (orderData.razorpayOrderId || "N/A");
    const totalAmount = orderData.totalAmount || 0;
    const paymentMethod = (orderData.paymentMethod || "COD").toUpperCase();

    let itemsRows = items.map((item, index) => {
        const title = item.title || item.name || item.productName || "Product";
        const price = item.price || item.productPrice || 0;
        const qty = item.qty || item.quantity || 1;
        const itemTotal = price * qty;
        return `
        <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 12px; font-size:13px; color:#1e293b;">${index + 1}. ${title}</td>
            <td style="padding:10px 12px; text-align:center; font-size:13px;">${qty}</td>
            <td style="padding:10px 12px; text-align:right; font-size:13px;">₹${price}</td>
            <td style="padding:10px 12px; text-align:right; font-weight:bold; font-size:13px;">₹${itemTotal}</td>
        </tr>`;
    }).join("");

    const customerName = shipping.name || (shipping.firstName ? `${shipping.firstName} ${shipping.lastName || ''}`.trim() : (userDetails.name || 'Customer'));
    const customerEmail = shipping.email || userDetails.email || 'N/A';
    const customerPhone = shipping.phone || userDetails.phone || 'N/A';
    const customerAddress = [
        shipping.address || shipping.street,
        shipping.city,
        shipping.state,
        shipping.pincode || shipping.postalCode,
        shipping.country
    ].filter(Boolean).join(", ");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Order Alert</title></head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
            <td align="center">
                <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; border:1px solid #e2e8f0; overflow:hidden;">
                    <tr>
                        <td style="background:#0f3a69; padding:20px 24px; color:#ffffff;">
                            <h2 style="margin:0; font-size:20px;">🛒 New Order Received - ₹${totalAmount}</h2>
                            <p style="margin:4px 0 0; color:#93c5fd; font-size:13px;">Order #${orderId} has been placed successfully</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px;">
                            <h3 style="margin:0 0 10px; font-size:15px; color:#0f172a;">Customer & Delivery Details</h3>
                            <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse; font-size:13px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:20px;">
                                <tr><td style="width:130px; font-weight:bold; color:#475569;">Customer:</td><td>${customerName}</td></tr>
                                <tr><td style="font-weight:bold; color:#475569;">Email:</td><td><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
                                <tr><td style="font-weight:bold; color:#475569;">Phone:</td><td>${customerPhone}</td></tr>
                                <tr><td style="font-weight:bold; color:#475569;">Shipping Address:</td><td>${customerAddress || 'N/A'}</td></tr>
                                <tr><td style="font-weight:bold; color:#475569;">Payment Method:</td><td><strong>${paymentMethod}</strong> (Status: ${orderData.PaymentStatus || orderData.status || 'processing'})</td></tr>
                            </table>

                            <h3 style="margin:0 0 10px; font-size:15px; color:#0f172a;">Order Items</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:16px;">
                                <thead>
                                    <tr style="background:#f1f5f9; text-align:left; font-size:12px; color:#475569;">
                                        <th style="padding:8px 12px;">Product</th>
                                        <th style="padding:8px 12px; text-align:center;">Qty</th>
                                        <th style="padding:8px 12px; text-align:right;">Price</th>
                                        <th style="padding:8px 12px; text-align:right;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsRows}
                                    <tr style="background:#f8fafc; font-weight:bold;">
                                        <td colspan="3" style="padding:10px 12px; text-align:right; font-size:14px;">Grand Total:</td>
                                        <td style="padding:10px 12px; text-align:right; color:#0f3a69; font-size:15px;">₹${totalAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

module.exports = {
    createSlug,
    transporter,
    sendEmailSafe,
    getWelcomeEmailHtml,
    getNewUserAlertHtml,
    getOrderConfirmationHtml,
    getNewOrderAlertHtml
};