const twilio = require('twilio');
const config = require('../config');

class WhatsAppNotifier {
  constructor() {
    if (!config.whatsapp.enabled) {
      console.log('WhatsApp notifications are disabled');
      return;
    }

    this.client = twilio(config.whatsapp.accountSid, config.whatsapp.authToken);
  }

  async send(message) {
    if (!config.whatsapp.enabled) {
      console.log('WhatsApp notifications are disabled. Skipping WhatsApp.');
      return false;
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: config.whatsapp.from,
        to: config.whatsapp.to
      });

      console.log('WhatsApp message sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error.message);
      return false;
    }
  }

  async notifyResultAvailable(url) {
    const message = `🎉 *Result Website is Now Available!*\n\nThe result website is now accessible at:\n${url}\n\nPlease visit the website to check your results.`;
    return await this.send(message);
  }
}

module.exports = WhatsAppNotifier;
