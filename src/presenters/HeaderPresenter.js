import AuthModel from "../models/AuthModel.js";
import ApiService from "../services/ApiService.js";

export class HeaderPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthModel();
    this.notifEnabled = false; // Status notifikasi

    // Memastikan header di-render ulang saat status otentikasi berubah
    window.addEventListener("authChanged", () => this.initializeHeader());
    this.initializeHeader(); // Render header saat pertama kali diinisialisasi
  }

  // Metode untuk menginisialisasi dan merender tampilan header
  async initializeHeader() {
    const isAuthenticated = this.model.isAuthenticated();
    this.view.render(isAuthenticated); // Merender tampilan berdasarkan status otentikasi

    // Mengaitkan event listener dari view ke metode presenter
    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindSkipLink();
    this.view.bindNotificationToggle(this.handleNotificationToggle.bind(this)); 

    await this._updateSubscriptionStatus(); // Memperbarui status langganan notifikasi
  }

  // --- Metode Penanganan Otentikasi ---
  handleLogout() {
    this.model.removeToken(); // Hapus token dari penyimpanan lokal
    this.view.notifyAuthChanged(); // Beri tahu aplikasi bahwa otentikasi berubah
    this.view.redirectToLogin(); // Arahkan ke halaman login
  }

  // --- Metode Penanganan Notifikasi Push ---
  async _updateSubscriptionStatus() { 
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Fitur notifikasi push tidak didukung oleh browser ini."); 
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      this.notifEnabled = !!subscription; // Langsung set true jika ada subscription
      this.view.updateNotifButtonState(this.notifEnabled);
    } catch (error) {
      console.error("Gagal memeriksa status langganan notifikasi push:", error); 
      this.notifEnabled = false;
      this.view.updateNotifButtonState(this.notifEnabled);
    }
  }

  async handleNotificationToggle() { 
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      alert("Browser Anda tidak mendukung notifikasi push."); 
      return;
    }

    const currentPermission = Notification.permission;
    let serviceWorkerRegistration;
    let pushSubscription = null;

    try {
      serviceWorkerRegistration = await navigator.serviceWorker.ready;
      pushSubscription = await serviceWorkerRegistration.pushManager.getSubscription();
    } catch (err) {
      console.error("Kesalahan saat mendapatkan registrasi service worker atau langganan:", err); 
      alert("Terjadi masalah saat memverifikasi langganan notifikasi."); 
      return;
    }

    const userAuthToken = this.model.getToken();
    if (!userAuthToken) {
      this.view.showAlert("Anda perlu login untuk mengelola pengaturan notifikasi."); 
      return;
    }

    if (!this.notifEnabled) { // Jika notifikasi belum aktif (ingin mengaktifkan)
      if (currentPermission === "denied") {
        alert(
          "Anda telah menolak izin notifikasi. Mohon sesuaikan di pengaturan browser Anda.", 
        );
        return;
      }

      try {
        if (!pushSubscription) {
          pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",
            ),
          });
        }

        const { endpoint, keys } = pushSubscription.toJSON();
        await ApiService.getSubscribed(userAuthToken, endpoint, keys);

        this.notifEnabled = true;
        this.view.updateNotifButtonState(true);
        this._displayAppNotification("Notifikasi berhasil diaktifkan!"); 
      } catch (e) {
        console.error("Gagal berlangganan notifikasi push:", e); 
        if (Notification.permission === "denied") {
          alert(
            "Izin notifikasi ditolak. Tidak dapat mengaktifkan notifikasi.", 
          );
        } else {
          alert(
            "Gagal mengaktifkan notifikasi. Pastikan Anda terhubung ke internet dan coba lagi.", 
          );
        }
        this.notifEnabled = false;
        this.view.updateNotifButtonState(false);
      }
    } else { // Jika notifikasi sudah aktif (ingin menonaktifkan)
      try {
        if (pushSubscription) {
          const { endpoint } = pushSubscription;
          await ApiService.getUnsubscribe(userAuthToken, endpoint);
          await pushSubscription.unsubscribe(); // Hapus langganan dari browser
        }

        this.notifEnabled = false;
        this.view.updateNotifButtonState(false);
        alert("Notifikasi telah dinonaktifkan."); 
      } catch (e) {
        console.error("Gagal berhenti berlangganan notifikasi push:", e); 
        alert("Tidak dapat menonaktifkan notifikasi. Silakan coba lagi."); 
      }
    }
  }

  _displayAppNotification(message) { 
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Aplikasi Cerita", { 
          body: message,
          icon: "/pwa-192x192.png",
          data: { url: "/" },
        });
      });
    }
  }

  // --- Metode Utilitas ---
  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}