import config from '../config.js';
import twilio from 'twilio';

export async function sendWhatsApp({ to, message }) {
  if (!config.notify.whatsapp.enabled) return;
  const { accountSid, authToken, from } = config.notify.whatsapp.twilio;
  if (!accountSid || !authToken || !from) {
    console.warn('[whatsapp] Twilio not configured; skipping send');
    return;
  }
  const client = twilio(accountSid, authToken);
  await client.messages.create({
    from: `whatsapp:${from}`,
    to: `whatsapp:${to}`,
    body: message,
  });
}
