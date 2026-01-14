import nodemailer from 'nodemailer';
import config from '../config.js';

export async function sendEmail({ to, subject, text }) {
  if (!config.notify.email.enabled) return;
  const { host, port, secure, user, pass } = config.notify.email.smtp;
  if (!host || !user || !pass) {
    console.warn('[email] SMTP not configured; skipping send');
    return;
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  const mail = {
    from: config.notify.email.from || user,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mail);
}
