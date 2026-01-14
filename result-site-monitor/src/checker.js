import config from './config.js';
import { sendEmail } from './notifier/email.js';
import { sendWhatsApp } from './notifier/whatsapp.js';
import { sendTelegram } from './notifier/telegram.js';

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

let lastUp = undefined; // undefined until first check
let lastNotifyAt = 0;

async function checkOnce() {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), config.timeoutMs);
    const res = await fetch(config.url, { method: 'GET', signal: controller.signal });
    clearTimeout(t);

    const isStatusOk = res.status === config.expectStatus;
    let bodyOk = true;
    if (config.keyword) {
      const text = await res.text();
      bodyOk = text.includes(config.keyword);
    }
    const isUp = isStatusOk && bodyOk;

    if (isUp) {
      log(`UP: ${config.url} status=${res.status}${config.keyword ? ' keyword=ok' : ''}`);
      if (lastUp === false) {
        await notifyAll('Result site recovered', `✅ ${config.url} is back up (status ${res.status}).`);
      }
      lastUp = true;
      return;
    }

    const reason = !isStatusOk ? `status ${res.status}` : `keyword missing`;
    await handleDown(`❌ ${config.url} appears DOWN (${reason}).`);
  } catch (err) {
    const msg = err.name === 'AbortError' ? `timeout after ${config.timeoutMs}ms` : err.message;
    await handleDown(`❌ ${config.url} check error: ${msg}`);
  }
}

async function handleDown(message) {
  log(message);
  const now = Date.now();
  const shouldNotify = lastUp !== false || now - lastNotifyAt >= config.notifyCooldownMs;
  if (shouldNotify) {
    await notifyAll('Result site issue', message);
    lastNotifyAt = now;
  }
  lastUp = false;
}

async function notifyAll(subject, message) {
  const timestamp = new Date().toISOString();
  const telegramMessage = `<b>${subject}</b>\n\n${message}\n\n🌐 URL: ${config.url}\n⏰ ${timestamp}`;
  
  const promises = [];
  if (config.notify.email.enabled && config.notify.email.to) {
    promises.push(sendEmail({ to: config.notify.email.to, subject, text: message }));
  }
  if (config.notify.whatsapp.enabled && config.notify.whatsapp.to) {
    promises.push(sendWhatsApp({ to: config.notify.whatsapp.to, message }));
  }
  if (config.notify.telegram.enabled && config.notify.telegram.chatId) {
    promises.push(sendTelegram({ message: telegramMessage }));
  }
  await Promise.all(promises);
}

function start() {
  log(`Starting monitor for ${config.url} every ${config.checkIntervalMs}ms`);
  checkOnce();
  setInterval(checkOnce, config.checkIntervalMs);
}

start();
