/**
 * Live SMTP Email Verification Test Script
 * Dispatches test transactional email to tchophilding@icloud.com
 * Run with: node scripts/test_email.js
 */

const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env.local variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

console.log("==================================================");
console.log("📧 TRANSWORLD LOGISTICS - LIVE SMTP ICLOUD TEST");
console.log("==================================================\n");

const targetEmail = process.argv[2] || "tchophilding@icloud.com";

async function createTransporter(port, secure) {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.spacemail.com',
        port: port,
        secure: secure,
        auth: {
            user: process.env.SMTP_USER || 'supportdesk@transworldlogistics.org',
            pass: process.env.SMTP_PASS || 'Marc1234?',
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        tls: {
            rejectUnauthorized: false
        }
    });
}

async function runSmtpTest() {
    const portsToTry = [
        { port: 465, secure: true },
        { port: 587, secure: false },
        { port: 25, secure: false }
    ];

    let workingTransporter = null;
    let selectedPort = null;

    for (const option of portsToTry) {
        console.log(`Testing Spacemail SMTP connection on Port ${option.port} (secure: ${option.secure})...`);
        try {
            const transporter = await createTransporter(option.port, option.secure);
            await transporter.verify();
            console.log(`  ✅ SMTP Handshake Successful on Port ${option.port}!\n`);
            workingTransporter = transporter;
            selectedPort = option;
            break;
        } catch (err) {
            console.log(`  ⚠️ Port ${option.port} failed: ${err.message}`);
        }
    }

    if (!workingTransporter) {
        console.error("\n❌ ALL SMTP PORTS (465, 587, 25) TIMED OUT. Check network connection.");
        process.exit(1);
    }

    console.log(`Dispatching Live Test Shipment Notification to: ${targetEmail}...`);

    const trackingNumber = `SWL${Math.floor(100000000 + Math.random() * 900000000)}`;

    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Transworld Logistics'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'supportdesk@transworldlogistics.org'}>`,
        to: targetEmail,
        replyTo: process.env.FROM_EMAIL || process.env.SMTP_USER || 'supportdesk@transworldlogistics.org',
        subject: `Transworld Logistics: Delivery Notification ${trackingNumber}`,
        headers: {
            'X-Mailer': 'Transworld Logistics-Shipping/1.0',
            'Auto-Submitted': 'auto-generated',
            'List-Unsubscribe': `<mailto:supportdesk@transworldlogistics.org?subject=unsubscribe>`
        },
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                <div style="background-color: #050508; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #0070F3; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">TRANSWORLD LOGISTICS</h1>
                    <p style="color: #ffffff; margin: 5px 0 0; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7;">Live System Test & Dispatch Verification</p>
                </div>
                <div style="padding: 40px; background-color: #ffffff;">
                    <h2 style="color: #0f172a; font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px;">Automated Delivery Verification</h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; font-weight: 500;">
                        Hello, this is an automated delivery test dispatched from the <strong>Transworld Logistics Platform</strong> to verify live SMTP delivery to your inbox.
                    </p>
                    
                    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 10px; margin: 0 0 8px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Tracking Signature</p>
                        <p style="color: #0070f3; font-family: monospace; font-size: 26px; font-weight: 900; margin: 0;">
                            ${trackingNumber}
                        </p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Origin Hub</span><br/>
                                <strong style="color: #0f172a; font-size: 14px;">Dallas HQ, USA</strong>
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
                                <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Recipient Email</span><br/>
                                <strong style="color: #0f172a; font-size: 14px;">${targetEmail}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0;">
                                <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">SMTP Protocol</span><br/>
                                <strong style="color: #10b981; font-size: 14px;">Spacemail Port ${selectedPort.port}</strong>
                            </td>
                            <td style="padding: 12px 0; text-align: right;">
                                <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; font-weight: 800;">Delivery Status</span><br/>
                                <strong style="color: #10b981; font-size: 14px;">SUCCESSFUL DISPATCH</strong>
                            </td>
                        </tr>
                    </table>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="https://transworldlogistics.org/tracking" style="background-color: #0070F3; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">Access Tracking Portal</a>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                    <p>© 2026 Transworld Logistics. Operational Integrity Verified.</p>
                </div>
            </div>
        `
    };

    try {
        const info = await workingTransporter.sendMail(mailOptions);
        console.log("  ✅ EMAIL DELIVERED SUCCESSFULLY!");
        console.log(`  Message ID: ${info.messageId}`);
        console.log(`  Accepted Recipients: ${JSON.stringify(info.accepted)}`);
        console.log("\n==================================================");
        console.log("🎉 LIVE SMTP TEST PASSED SUCCESSFULLY!");
        console.log("==================================================\n");
    } catch (err) {
        console.error("\n❌ SEND MAIL ERROR:", err.message);
        console.error("Full email error:", err);
        console.error("Response:", err?.response);
        console.error("Response code:", err?.responseCode);
        process.exit(1);
    }
}

runSmtpTest();
