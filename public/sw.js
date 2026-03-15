// DSA Tracker Service Worker — Daily Reminder Notifications
// Minimal implementation, no external dependencies

const APP_URL = self.location.origin + "/";

let reminderData = {
  day: 1,
  topic: "DSA practice",
  streak: 0,
};

// Listen for messages from the main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SCHEDULE_REMINDER") {
    reminderData = event.data.data;
    scheduleNextReminder();
  }
});

// On install, activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  scheduleNextReminder();
});

// On notification click, open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url === APP_URL && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(APP_URL);
    })
  );
});

function scheduleNextReminder() {
  const now = new Date();
  const target = new Date();
  target.setHours(9, 0, 0, 0);

  // If 9 AM has passed today, schedule for tomorrow
  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    showNotification();
    // Schedule next day
    scheduleNextReminder();
  }, delay);
}

function showNotification() {
  const { day, topic, streak } = reminderData;
  self.registration.showNotification("30-Day DSA Tracker", {
    body: `Day ${day} — ${topic} · Your DSA streak is ${streak} days 🔥`,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "dsa-daily-reminder",
    renotify: true,
    requireInteraction: false,
  });
}
