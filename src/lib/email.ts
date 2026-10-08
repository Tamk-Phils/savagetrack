import nodemailer from 'nodemailer';

function getTransporter() {
    const host = process.env.SMTP_HOST || 'mail.spacemail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'support@vanguardfreight.com';
    const pass = process.env.SMTP_PASS || 'Marc1234?';

    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        auth: {
            user: user,
            pass: pass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
        tls: {
            rejectUnauthorized: false
        }
    });
}

interface BaseEmailParams {
    to: string;
    subject: string;
    trackingNumber: string;
    recipientName: string;
}

interface NewShipmentParams extends BaseEmailParams {
    adminEmail?: string;
    senderName: string;
    origin: string;
    destination: string;
}

interface UpdateShipmentParams extends BaseEmailParams {
    adminEmail?: string;
    newStatus: string;
    location: string;
    description: string;
}

const getTrackingLink = () => `${process.env.NEXT_PUBLIC_APP_URL || "https://vanguardfreight.com"}/tracking`;

function getMailIdentity() {
    const address = (process.env.FROM_EMAIL || process.env.SMTP_USER || "support@vanguardfreight.com").trim();
    return {
        address,
        name: process.env.FROM_NAME || "Vanguard Freight"
    };
}

function cleanAddress(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

export async function sendShipmentCreatedEmail({
    to,
    adminEmail,
    subject,
    trackingNumber,
    senderName,
    recipientName,
    origin,
    destination
}: NewShipmentParams) {
    const trackingLink = getTrackingLink();
    const mailIdentity = getMailIdentity();
    const recipient = cleanAddress(to);
    const adminCopy = cleanAddress(adminEmail) || mailIdentity.address;

    const htmlContent = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #ffffff;">
            <div style="background-color: #050508; padding: 30px; text-align: center; border-radius: 4px 4px 0 0;">
                <h1 style="color: #0070F3; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">VANGUARD FREIGHT</h1>
                <p style="color: #ffffff; margin: 5px 0 0; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; opacity: 0.5;">Operational Data</p>
            </div>
            <div style="padding: 40px; background-color: #ffffff;">
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin-bottom: 20px;">System Initiated: New Shipment</h2>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    IDENTIFIER: <strong>${recipientName}</strong>,
                </p>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    A new transit service has been established by <strong>${senderName}</strong>. Your asset is now being tracked across the Vanguard Freight network.
                </p>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 4px; margin: 30px 0; border: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 9px; margin: 0 0 10px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Tracking Signature</p>
                    <p style="color: #0070f3; font-family: monospace; font-size: 28px; font-weight: 900; margin: 0;">
                        ${trackingNumber}
                    </p>
                </div>

                <div style="margin: 30px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="color: #94a3b8; font-size: 9px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Origin Office</span><br/>
                                <strong style="color: #0f172a; font-size: 14px; text-transform: uppercase;">${origin}</strong>
                            </td>
                            <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
                                <span style="color: #94a3b8; font-size: 9px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Destination Office</span><br/>
                                <strong style="color: #0f172a; font-size: 14px; text-transform: uppercase;">${destination}</strong>
                            </td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${trackingLink}" style="background-color: #0070F3; color: white; padding: 18px 36px; text-decoration: none; border-radius: 2px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Enter Portal</a>
                </div>
            </div>
            <div style="text-align: center; padding: 30px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        </div>
    `;

    const textContent = `
VANGUARD FREIGHT - SHIPMENT REGISTRATION NOTICE

Hello ${recipientName},

A new shipment has been registered by ${senderName}.
Tracking Signature: ${trackingNumber}
Origin: ${origin}
Destination: ${destination}

Track your package online at: ${trackingLink}

Thank you for choosing Vanguard Freight & Cargo.
Support Email: support@vanguardfreight.com
`;

    if (!recipient) {
        return { success: false, error: new Error("Missing recipient address") };
    }

    try {
        await getTransporter().sendMail({
            from: mailIdentity,
            to: recipient,
            bcc: adminCopy && adminCopy !== recipient ? adminCopy : undefined,
            replyTo: mailIdentity.address,
            subject,
            text: textContent,
            html: htmlContent,
            headers: {
                'X-Mailer': 'Vanguard Freight-Shipping/1.0'
            }
        });
        console.log(`Email successfully dispatched to: ${recipient}`);
        if (adminCopy && adminCopy !== recipient) {
            console.log(`Admin copy included for: ${adminCopy}`);
        }
        return { success: true, error: undefined };
    } catch (error: any) {
        console.error(`Nodemailer dispatch error for ${recipient}:`, error);
        console.error("Full email error:", error);
        console.error("Response:", error?.response);
        console.error("Response code:", error?.responseCode);
        return { success: false, error };
    }
}

export async function sendShipmentUpdateEmail({
    to,
    subject,
    trackingNumber,
    recipientName,
    newStatus,
    location,
    description
}: UpdateShipmentParams) {
    const trackingLink = getTrackingLink();
    const mailIdentity = getMailIdentity();
    const recipient = cleanAddress(to);

    const htmlContent = `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #ffffff;">
            <div style="background-color: #050508; padding: 30px; text-align: center; border-radius: 4px 4px 0 0;">
                <h1 style="color: #0070F3; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">VANGUARD FREIGHT</h1>
                <p style="color: #ffffff; margin: 5px 0 0; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; opacity: 0.5;">Operational Data</p>
            </div>
            <div style="padding: 40px; background-color: #ffffff;">
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; margin-bottom: 20px;">Data Update</h2>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    IDENTIFIER: <strong>${recipientName}</strong>,
                </p>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    Delivery signature <strong>${trackingNumber}</strong> has been updated in the global ledger.
                </p>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 4px; margin: 30px 0; border: 1px solid #e2e8f0;">
                    <div style="margin-bottom: 20px;">
                        <p style="color: #94a3b8; font-size: 9px; margin: 0 0 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">New Status</p>
                        <p style="color: #0070f3; font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase;">${newStatus}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p style="color: #94a3b8; font-size: 9px; margin: 0 0 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">Current Office</p>
                        <p style="color: #0f172a; font-size: 14px; margin: 0; font-weight: 700; text-transform: uppercase;">${location || "In Delivery"}</p>
                    </div>
                    <div>
                        <p style="color: #94a3b8; font-size: 9px; margin: 0 0 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">System Details</p>
                        <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: 500; line-height: 1.5;">${description || "No additional variance reported."}</p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${trackingLink}" style="background-color: #0070F3; color: white; padding: 18px 36px; text-decoration: none; border-radius: 2px; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">Enter Portal</a>
                </div>
            </div>
            <div style="text-align: center; padding: 30px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        </div>
    `;

    const textContent = `
VANGUARD FREIGHT - SHIPMENT UPDATE NOTICE

Hello ${recipientName},

Shipment Signature: ${trackingNumber}
New Status: ${newStatus}
Current Office: ${location || 'In Delivery'}
Details: ${description || 'No additional variance reported.'}

Track package online at: ${trackingLink}

Support Email: support@vanguardfreight.com
`;

    if (!recipient) {
        return { success: false, error: new Error("Missing recipient address") };
    }

    try {
        await getTransporter().sendMail({
            from: mailIdentity,
            to: recipient,
            replyTo: mailIdentity.address,
            subject,
            text: textContent,
            html: htmlContent,
            headers: {
                'X-Mailer': 'Vanguard Freight-Shipping/1.0'
            }
        });
        console.log(`Update email successfully dispatched to: ${recipient}`);
        return { success: true, error: undefined };
    } catch (error: any) {
        console.error(`Nodemailer update dispatch error for ${recipient}:`, error);
        console.error("Full email error:", error);
        console.error("Response:", error?.response);
        console.error("Response code:", error?.responseCode);
        return { success: false, error };
    }
}
