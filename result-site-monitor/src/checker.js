const axios = require('axios');
const config = require('./config');
const EmailNotifier = require('./notifier/email');
const WhatsAppNotifier = require('./notifier/whatsapp');

class ResultChecker {
  constructor() {
    this.emailNotifier = new EmailNotifier();
    this.whatsappNotifier = new WhatsAppNotifier();
    this.isAvailable = false;
    this.checkCount = 0;
  }

  async checkWebsite() {
    this.checkCount++;
    console.log(`\n[${new Date().toLocaleString()}] Check #${this.checkCount}: Checking ${config.resultUrl}...`);

    try {
      const response = await axios.get(config.resultUrl, {
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500
      });

      if (response.status >= 200 && response.status < 400) {
        console.log(`✅ Website is available (Status: ${response.status})`);
        
        if (!this.isAvailable) {
          // Website just became available
          this.isAvailable = true;
          await this.sendNotifications();
        }
        
        return true;
      } else {
        console.log(`❌ Website returned status: ${response.status}`);
        this.isAvailable = false;
        return false;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        console.log(`❌ Website is not reachable: ${error.message}`);
      } else {
        console.log(`❌ Error checking website: ${error.message}`);
      }
      this.isAvailable = false;
      return false;
    }
  }

  async sendNotifications() {
    console.log('\n🔔 Sending notifications...');
    
    const promises = [];
    
    if (config.email.enabled) {
      promises.push(this.emailNotifier.notifyResultAvailable(config.resultUrl));
    }
    
    if (config.whatsapp.enabled) {
      promises.push(this.whatsappNotifier.notifyResultAvailable(config.resultUrl));
    }

    if (promises.length === 0) {
      console.log('⚠️ No notification methods enabled. Please configure email or WhatsApp in .env file.');
    } else {
      await Promise.all(promises);
    }
  }

  start() {
    console.log('🚀 Result Site Monitor Started');
    console.log(`📍 Monitoring: ${config.resultUrl}`);
    console.log(`⏱️  Check interval: ${config.checkInterval} minute(s)`);
    console.log(`📧 Email notifications: ${config.email.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`📱 WhatsApp notifications: ${config.whatsapp.enabled ? 'Enabled' : 'Disabled'}`);
    console.log('---');

    // Initial check
    this.checkWebsite();

    // Schedule periodic checks
    const intervalMs = config.checkInterval * 60 * 1000;
    setInterval(() => {
      this.checkWebsite();
    }, intervalMs);
  }
}

// Start the checker
const checker = new ResultChecker();
checker.start();

module.exports = ResultChecker;
