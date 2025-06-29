const CACHE_NAME = "story-app-cache-v4"; // Nama cache yang diperbarui untuk memaksa aktivasi baru
const APP_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // PERHATIAN: Pastikan jalur ini sesuai dengan file yang dihasilkan oleh proses build Anda
  "/assets/index-DxoEJ1Mx.css", // Sesuaikan dengan nama file CSS yang di-bundle
  "/assets/index-BMe6iyxB.js",  // Sesuaikan dengan nama file JS yang di-bundle
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  // Tambahkan halaman fallback untuk navigasi offline yang lebih baik
  // Pastikan Anda memiliki file fallback.html di folder 'public' Anda
  // "/fallback.html", // Opsional, uncomment jika Anda membuatnya
];

// --- Event: Install ---
self.addEventListener("install", (event) => {
  console.log("Service Worker: Memulai proses instalasi...");
  self.skipWaiting(); // Memastikan Service Worker baru segera aktif

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Meng-cache aset utama aplikasi.");
        // Menangkap error saat addAll untuk mencegah instalasi gagal total
        return cache.addAll(APP_SHELL_ASSETS).catch((error) => {
          console.error("Service Worker: Gagal meng-cache beberapa aset. Ini mungkin karena masalah jaringan saat instalasi atau jalur aset yang salah:", error);
          // Anda bisa memilih untuk melempar error di sini jika Anda ingin instalasi gagal total
          // throw error;
        });
      })
      .catch((error) => {
        console.error("Service Worker: Gagal membuka cache selama instalasi:", error);
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
              .map((key) => {
                console.log(`Service Worker: Menghapus cache lama: ${key}`);
                return caches.delete(key);
              }),
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

  // 1. Strategi Cache-First untuk navigasi (index.html atau fallback.html)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches
        .match(event.request) // Coba cari URL yang diminta (misal #/add, #/detail/1)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Jika ada di cache, langsung sajikan
          }
          // Jika tidak ada di cache, coba ambil dari jaringan, dan berikan fallback jika gagal
          return fetch(event.request).catch(() => {
            // Jika jaringan gagal, sajikan index.html dari cache atau halaman fallback
            return caches.match("/index.html")
                    // || caches.match("/fallback.html") // Uncomment jika menggunakan fallback.html
                    || new Response("<h1>Offline</h1><p>Maaf, halaman ini tidak dapat dimuat saat offline.</p>", { headers: { 'Content-Type': 'text/html' }});
          });
        })
        .catch((error) => {
          console.error("Service Worker: Kegagalan fetch navigasi:", error);
          // Fallback akhir jika ada masalah serius
          return new Response("<h1>Terjadi Masalah Offline</h1><p>Tidak dapat memuat halaman.</p>", { headers: { 'Content-Type': 'text/html' }});
        })
    );
    return;
  }

  // 2. Strategi Network-Only dengan fallback Offline untuk API eksternal (Tanpa Cache Data API di SW)
  if (requestUrl.origin === "https://story-api.dicoding.dev") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Ketika API gagal (offline), kembalikan respons JSON error kustom
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

  // 3. Strategi Cache-First, lalu Network untuk aset lainnya (CSS, JS, Gambar PWA, dll.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // Sajikan dari cache jika ditemukan
      }
      // Jika tidak di cache, coba ambil dari jaringan, dan tangani kegagalan
      return fetch(event.request).catch((error) => { // <-- Menangkap TypeError: Failed to fetch di sini
        console.error(`Service Worker: Gagal memuat aset (${event.request.url}) dari jaringan atau cache:`, error);
        // Anda bisa memberikan respons placeholder tergantung jenis aset
        if (event.request.destination === 'image') {
          // Contoh: mengembalikan gambar placeholder transparan 1x1 piksel untuk ikon yang hilang
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
        }
        // Untuk CSS/JS yang gagal, bisa mengembalikan respons kosong atau error status
        return new Response("", { status: 408, statusText: "Offline" });
      });
    })
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