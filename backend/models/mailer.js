// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: ` <${to}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Mail envoyé !");
  } catch (error) {
    console.error('❌ Erreur envoi mail :', error);
  }
};

module.exports = sendMail;
