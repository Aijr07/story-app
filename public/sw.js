const CACHE_NAME = "story-app-cache-v3"; 
const APP_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // "/style.css", 
  // "/main.js",   
  "/pwa-192x192.png",
  "/pwa-512x512.png",
];

// --- Event: Install ---
self.addEventListener("install", (event) => {
  console.log("Service Worker: Memulai proses instalasi...");
  self.skipWaiting(); // Memastikan Service Worker baru segera aktif

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Meng-cache aset statis aplikasi.");
        return cache.addAll(APP_SHELL_ASSETS);
      })
      .catch((error) => {
        console.error("Service Worker: Gagal menyimpan aset ke cache:", error);
      }),
  );
});

// --- Event: Activate ---
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Mengaktifkan dan membersihkan cache lama.");
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((cacheKeys) =>
          Promise.all(
            cacheKeys
              .filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key)),
          ),
        ),
      clients.claim(), // Mengambil kendali atas semua klien yang belum dikendalikan
    ]).then(() => {
      console.log("Service Worker: Berhasil aktif dan cache usang telah dihapus.");
    }),
  );
});

// --- Event: Fetch ---
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategi Cache-First untuk navigasi
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/index.html")
        .then((cachedResponse) => cachedResponse || fetch(event.request)),
    );
    return;
  }

  // Strategi Network-Only dengan fallback Offline untuk API eksternal
  if (requestUrl.origin === "https://story-api.dicoding.dev") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            error: true,
            message: "Tidak dapat memuat data: Anda sedang tidak online.",
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }),
    );
    return;
  }

  // Strategi Cache-First untuk aset lainnya
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});

// --- Event: Push Notification ---
self.addEventListener("push", (event) => {
  console.log("Service Worker: Menerima event push notification.");
  const notificationData = event.data ? event.data.json() : {};
  const notificationOptions = {
    body: notificationData.body || "Ada pembaruan cerita terbaru!",
    icon: "/pwa-192x192.png", // Path ke ikon notifikasi
    badge: "/pwa-192x192.png", // Path ke badge (ikon kecil di bar status)
    data: {
      url: notificationData.url || "/", // URL yang akan dibuka saat notifikasi diklik
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || "Notifikasi Aplikasi Cerita",
      notificationOptions,
    ),
  );
});

// --- Event: Notification Click ---
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notifikasi diklik", event.notification.data);
  event.notification.close(); // Tutup notifikasi setelah diklik

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const targetUrl =
          event.notification.data && event.notification.data.url
            ? event.notification.data.url
            : "/"; // URL default jika tidak ada

        let originToOpen = "";
        try {
          originToOpen = new URL(targetUrl, self.location.origin).origin;
        } catch (e) {
          console.error(
            "Service Worker: URL tidak valid pada data notifikasi, kembali ke root.",
            e,
          );
          originToOpen = self.location.origin;
        }

        let existingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.startsWith(originToOpen) && "focus" in client) {
            existingClient = client;
            break;
          }
        }

        if (existingClient) {
          return existingClient.focus(); // Fokus ke tab yang sudah ada
        } else {
          return clients.openWindow(targetUrl); // Buka tab baru
        }
      }),
  );
});