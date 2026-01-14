# Result Site Monitor

Simple structure scaffold for monitoring a result website and sending notifications via email or WhatsApp.

## Getting Started

1. Copy `.env.example` to `.env` and edit values.
2. Install Node.js 18+ (for built-in `fetch`).
3. Install dependencies:

```bash
npm --prefix ./result-site-monitor install dotenv nodemailer twilio
```

4. Run:

```bash
npm start --prefix ./result-site-monitor
```

## Project Structure

- `src/checker.js`: Periodic checker stub calling notifiers on failures.
- `src/config.js`: Loads settings from environment variables.
- `src/notifier/email.js`: Email notifier stub (add real SMTP integration).
- `src/notifier/whatsapp.js`: WhatsApp notifier stub (add real API integration).
- `.env`: Environment configuration.
- `package.json`: Scripts and metadata.

## Notes

- **Phase 1 (Current)**: Telegram notifications enabled
- **Phase 2**: Email via SMTP/Nodemailer (set `EMAIL_ENABLED=true` and configure `SMTP_*` variables)
- **Phase 3**: WhatsApp via Twilio (set `WHATSAPP_ENABLED=true` and configure `TWILIO_*` variables)
- Cooldown avoids spam by re-sending down alerts at intervals and sending a recovery alert when back up.
- Ensure your environment supports Node 18+ or add a `node-fetch` polyfill.
