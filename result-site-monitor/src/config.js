import 'dotenv/config';

const config = {
  url: process.env.TARGET_URL || 'https://example.com',
  checkIntervalMs: parseInt(process.env.CHECK_INTERVAL_MS || '60000', 10),
  timeoutMs: parseInt(process.env.TIMEOUT_MS || '10000', 10),
  expectStatus: parseInt(process.env.EXPECT_STATUS || '200', 10),
  keyword: process.env.KEYWORD || '',
  notifyCooldownMs: parseInt(process.env.NOTIFY_COOLDOWN_MS || '900000', 10),
  notify: {
    email: {
      enabled: process.env.EMAIL_ENABLED === 'true',
      to: process.env.EMAIL_TO || '',
      from: process.env.EMAIL_FROM || '',
      smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    whatsapp: {
      enabled: process.env.WHATSAPP_ENABLED === 'true',
      to: process.env.WHATSAPP_TO || '',
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        from: process.env.TWILIO_WHATSAPP_FROM || '',
      },
    },
    telegram: {
      enabled: process.env.TELEGRAM_ENABLED === 'true',
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      chatId: process.env.TELEGRAM_CHAT_ID || '',
    },
  },
};

export default config;
