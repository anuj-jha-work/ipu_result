# Result Site Monitor

A Node.js application that monitors a result website's availability and sends notifications via Email and/or WhatsApp when the site becomes accessible.

## Features

- 🔄 Periodic website availability checking
- 📧 Email notifications via SMTP
- 📱 WhatsApp notifications via Twilio
- ⚙️ Configurable check intervals
- 🎯 Automatic notification when site becomes available

## Project Structure

```
result-site-monitor/
├── src/
│   ├── checker.js          # Main monitoring logic
│   ├── notifier/
│   │   ├── email.js        # Email notification handler
│   │   └── whatsapp.js     # WhatsApp notification handler
│   └── config.js           # Configuration management
├── .env                    # Environment variables (create from .env.example)
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd result-site-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by editing the `.env` file with your settings

## Configuration

Edit the `.env` file to configure the monitor:

### Basic Settings

- `RESULT_URL`: The URL of the result website to monitor
- `CHECK_INTERVAL`: How often to check the website (in minutes)

### Email Notifications

To enable email notifications:

1. Set `EMAIL_ENABLED=true`
2. Configure SMTP settings:
   - `EMAIL_HOST`: SMTP server (e.g., smtp.gmail.com)
   - `EMAIL_PORT`: SMTP port (usually 587)
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASSWORD`: Your email password or app-specific password
   - `EMAIL_FROM`: Sender email address
   - `EMAIL_TO`: Recipient email address

**Note for Gmail users:** You need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

### WhatsApp Notifications

To enable WhatsApp notifications via Twilio:

1. Set `WHATSAPP_ENABLED=true`
2. Sign up for a [Twilio account](https://www.twilio.com/)
3. Configure Twilio settings:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_WHATSAPP_FROM`: Twilio WhatsApp number (e.g., whatsapp:+14155238886)
   - `TWILIO_WHATSAPP_TO`: Your WhatsApp number (e.g., whatsapp:+1234567890)

## Usage

Start the monitor:

```bash
npm start
```

The application will:
1. Start monitoring the configured URL
2. Check the website at the specified interval
3. Send notifications when the website becomes available

## Example Output

```
🚀 Result Site Monitor Started
📍 Monitoring: https://example.com/results
⏱️  Check interval: 5 minute(s)
📧 Email notifications: Enabled
📱 WhatsApp notifications: Disabled
---

[1/14/2026, 2:46:09 PM] Check #1: Checking https://example.com/results...
❌ Website is not reachable: ENOTFOUND

[1/14/2026, 2:51:09 PM] Check #2: Checking https://example.com/results...
✅ Website is available (Status: 200)

🔔 Sending notifications...
Email sent successfully: <message-id>
```

## How It Works

1. **Checker** (`src/checker.js`): Main component that periodically checks website availability
2. **Email Notifier** (`src/notifier/email.js`): Handles sending email notifications
3. **WhatsApp Notifier** (`src/notifier/whatsapp.js`): Handles sending WhatsApp messages via Twilio
4. **Config** (`src/config.js`): Loads and manages configuration from environment variables

## Troubleshooting

### Email not sending

- Verify your SMTP credentials
- For Gmail, ensure you're using an App Password
- Check if "Less secure app access" is enabled (not recommended) or use OAuth2

### WhatsApp not sending

- Verify your Twilio credentials
- Ensure your WhatsApp number is verified with Twilio
- Check Twilio console for error messages
- Make sure phone numbers include country code

### Website always shows as unavailable

- Verify the URL is correct
- Check if the website requires authentication
- Some websites may block automated requests

## License

ISC

## Contributing

Feel free to open issues or submit pull requests with improvements.
