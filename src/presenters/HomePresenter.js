import StoryModel from "../models/StoryModel.js";
import IndexedDBService from "../services/IndexedDBService.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  // Metode untuk memulai pemuatan dan menampilkan cerita
  async startLoadingStories() {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      console.warn("Kunci akses tidak ditemukan. Mengarahkan pengguna ke halaman masuk...");
      this.view.redirectToLogin();
      return;
    }

    await this._fetchStoriesWithFallback(userToken);
  }

  async _fetchStoriesWithFallback(token) {
    // ---- PERUBAHAN DI SINI ----
    const result = await this.model.getAllStories(token); // Ambil objek hasil lengkap
    if (result.error) {
      // Jika ada error dari API (termasuk respons offline dari SW)
      console.error(
        "Gagal mengambil cerita dari API, mencoba memuat dari penyimpanan offline:",
        result.message,
      );
      await this._retrieveStoriesFromOfflineStorage(); // Lakukan fallback
    } else {
      // Jika berhasil dari API
      this.view.renderStories(result.listStory);
    }
    // ---- AKHIR PERUBAHAN ----
  }

  async _retrieveStoriesFromOfflineStorage() {
    try {
      const offlineEntries = await IndexedDBService.getAllStories();
      if (offlineEntries.length > 0) {
        this.view.showAlert(
          "Tidak dapat terhubung ke server. Menampilkan konten dari penyimpanan offline.",
        );
        this.view.renderStories(offlineEntries);
      } else {
        this.view.showAlert(
          "Gagal memuat cerita. Periksa sambungan internet Anda atau coba lagi nanti.",
        );
      }
    } catch (databaseError) {
      console.error("Kesalahan saat memuat cerita dari IndexedDB:", databaseError);
      this.view.showAlert("Terjadi masalah saat mengakses data tersimpan di perangkat.");
    }
  }

  async init() {
    await this.startLoadingStories();
  }
}