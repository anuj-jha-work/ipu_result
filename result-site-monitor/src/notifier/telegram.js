import config from '../config.js';

export async function sendTelegram({ message }) {
  if (!config.notify.telegram.enabled) return;
  
  const { botToken, chatId } = config.notify.telegram;
  if (!botToken || !chatId) {
    console.warn('[telegram] Bot token or chat ID not configured; skipping send');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[telegram] Failed to send message: ${response.status} ${errorData}`);
      return;
    }

    console.log('[telegram] Message sent successfully');
  } catch (error) {
    console.error(`[telegram] Error sending message: ${error.message}`);
  }
}
