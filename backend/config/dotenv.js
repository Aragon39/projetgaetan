const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporter Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com', // Remplacez par le serveur SMTP approprié
  port: 465,
  secure: true, // true pour utiliser SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // Utilisateur SMTP
    pass: process.env.EMAIL_PASS, // Mot de passe SMTP
  },
});

module.exports = transporter;