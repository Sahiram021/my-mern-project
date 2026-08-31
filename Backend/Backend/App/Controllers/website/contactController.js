const { sendEmailSafe } = require("../../config/helper");
const contactEnquiryModel = require("../../Models/contactEnquiryModel");

let saveEnquiry = async (req, res) => {
    try {
        let { name, email, phone, message } = req.body;

        // Save enquiry to database
        let contectRes = await contactEnquiryModel.create({
            name,
            email,
            phone,
            message
        });

        // Send enquiry notification email to owner
        const ownerEmail = process.env.OWNER_EMAIL || process.env.ADMINEMAIL || process.env.SMTP_USER;
        if (ownerEmail) {
            sendEmailSafe({
                to: ownerEmail,
                subject: `New Contact Enquiry from ${name || 'Website Visitor'}`,
                html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>JGB Trading | Contact Enquiry</title></head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background:#0f3a69; padding:22px 28px; color:#ffffff;">
                            <h2 style="margin:0; font-size:20px;">📩 New Contact Enquiry</h2>
                            <p style="margin:4px 0 0; color:#93c5fd; font-size:13px;">Received from JGB Trading Contact Form</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px; margin-bottom:20px;">
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                    <td style="width:120px; font-weight:bold; color:#475569;">Name:</td>
                                    <td style="color:#0f172a; font-weight:600;">${name || 'N/A'}</td>
                                </tr>
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td style="font-weight:bold; color:#475569;">Email:</td>
                                    <td style="color:#2563eb;"><a href="mailto:${email}">${email || 'N/A'}</a></td>
                                </tr>
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                    <td style="font-weight:bold; color:#475569;">Phone:</td>
                                    <td style="color:#0f172a;">${phone || 'N/A'}</td>
                                </tr>
                            </table>

                            <div style="background:#fff7ed; border:1px solid #fed7aa; padding:16px 18px; border-radius:8px;">
                                <p style="margin:0 0 6px; font-size:12px; font-weight:bold; color:#c2410c; text-transform:uppercase;">Message</p>
                                <p style="margin:0; font-size:14px; color:#1e293b; line-height:1.6;">${message || 'No message provided'}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc; padding:14px 28px; border-top:1px solid #e2e8f0; font-size:12px; color:#64748b; text-align:center;">
                            This is an automated notification from JGB Trading website.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
            });
        }

        res.send({
            status: true,
            message: "Enquiry save successfully",
            contectRes
        });

    } catch (err) {
        console.error("Save Enquiry Error:", err);
        res.send({
            status: false,
            message: "Error saving enquiry",
            error: err.message
        });
    }
};

module.exports = { saveEnquiry };
