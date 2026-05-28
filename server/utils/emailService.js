const nodemailer = require('nodemailer');
const db = require('../db/client');

const getSettings = async () => {
  const result = await db.query('SELECT key, value FROM settings');
  const settings = {};
  result.rows.forEach(r => settings[r.key] = r.value);
  return settings;
};

const createTransporter = async () => {
  const settings = await getSettings();
  if (!settings.smtp_user || !settings.smtp_pass) return null;
  
  return nodemailer.createTransport({
    host: settings.smtp_host || 'smtp.gmail.com',
    port: parseInt(settings.smtp_port) || 587,
    secure: settings.smtp_port === '465',
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass,
    },
  });
};

const sendAdminNotification = async (lead) => {
  const settings = await getSettings();
  const transporter = await createTransporter();
  
  if (!transporter) {
    console.warn('Email service is not configured. Admin notification skipped.');
    return;
  }
  
  const adminEmail = settings.admin_email || settings.smtp_user;
  
  const mailOptions = {
    from: `"Next Core System" <${settings.smtp_user}>`,
    to: adminEmail,
    subject: `New Support Request: ${lead.service_type.toUpperCase()} from ${lead.name}`,
    text: `
A new support request has been submitted.
      
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || 'N/A'}
Organization: ${lead.organization || 'N/A'}
Service Type: ${lead.service_type}
      
Description:
${lead.description}
      
Please login to the admin dashboard to review and convert this lead.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification email sent for lead ${lead.id}`);
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
  }
};

const sendUserConfirmation = async (userEmail, lead) => {
  const transporter = await createTransporter();
  const settings = await getSettings();
  
  if (!transporter || !userEmail) {
    return;
  }

  const mailOptions = {
    from: `"Next Core System Support" <${settings.smtp_user}>`,
    to: userEmail,
    subject: 'Support Request Received - Next Core System',
    text: `
Dear ${lead.name},
      
Thank you for reaching out to Next Core System. We have received your support request regarding "${lead.service_type}".
      
Your reference number is: NCS-LEAD-${lead.id}
      
One of our IT technicians will review your request and contact you shortly at ${lead.phone}. 
      
Best Regards,
Next Core System Team
Bharatpur, Chitwan
+977-9841395330
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`User confirmation email sent to ${userEmail} for lead ${lead.id}`);
  } catch (error) {
    console.error('Failed to send user confirmation email:', error);
  }
};

const sendPasswordResetEmail = async (userEmail, tempPassword, userName) => {
  const transporter = await createTransporter();
  const settings = await getSettings();
  
  if (!transporter || !userEmail) {
    return;
  }

  const mailOptions = {
    from: `"Next Core System Support" <${settings.smtp_user}>`,
    to: userEmail,
    subject: 'Your Password Has Been Reset - Next Core System',
    text: `
Dear ${userName},
      
Your password has been securely reset as requested.
      
Your new temporary password is: ${tempPassword}
      
Please log in with this password and you can change it later from your profile.
      
Best Regards,
Next Core System Team
Bharatpur, Chitwan
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
};

module.exports = {
  sendAdminNotification,
  sendUserConfirmation,
  sendPasswordResetEmail
};
