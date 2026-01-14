const nodemailer = require('nodemailer');
const config = require('../config');

class EmailNotifier {
  constructor() {
    if (!config.email.enabled) {
      console.log('Email notifications are disabled');
      return;
    }
    
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async send(subject, message) {
    if (!config.email.enabled || !this.transporter) {
      console.log('Email notifications are disabled. Skipping email.');
      return false;
    }

    try {
      // Escape HTML entities to prevent XSS
      const escapeHtml = (text) => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const info = await this.transporter.sendMail({
        from: config.email.from,
        to: config.email.to,
        subject: subject,
        text: message,
        html: `<p>${escapeHtml(message)}</p>`
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error.message);
      return false;
    }
  }

  async notifyResultAvailable(url) {
    const subject = '🎉 Result Website is Now Available!';
    const message = `Good news! The result website is now accessible.\n\nURL: ${url}\n\nPlease visit the website to check your results.`;
    return await this.send(subject, message);
  }
}

module.exports = EmailNotifier;
