const nodemailer = require('nodemailer');
require('dotenv').config();

// Valider les variables d'environnement
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;

if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_SECURE || !EMAIL_USER || !EMAIL_PASS) {
  throw new Error('Tous les paramètres de configuration de l\'e-mail doivent être définis dans le fichier .env');
}

// Configuration de nodemailer avec les variables d'environnement
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT, 10), // Convertir en entier
  secure: EMAIL_SECURE === 'true', // Utilisation de SSL pour le port 465, sinon TLS pour le port 587
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2' // Assurez-vous d'utiliser au moins TLSv1.2
  },
  logger: true, // Activez les logs pour le débogage
  debug: true,  // Activez les logs de débogage
});

// Fonction pour envoyer un e-mail avec des paramètres personnalisés
const sendEmail = async (toEmail, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to: toEmail,
      subject: subject,
      text: text,
    });

    console.log('Message envoyé avec succès : %s', info.messageId);
    console.log('Prévisualisation de l\'URL : %s', nodemailer.getTestMessageUrl(info));
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error.message, error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };