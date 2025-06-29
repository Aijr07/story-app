import StoryModel from "../models/StoryModel.js";
import IndexedDBService from "../services/IndexedDBService.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  // Metode untuk memulai pemuatan dan menampilkan cerita
  async startLoadingStories() {
    // Memverifikasi keberadaan token otentikasi pengguna
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      console.warn("Kunci akses tidak ditemukan. Mengarahkan pengguna ke halaman masuk...");
      this.view.redirectToLogin();
      return; // Menghentikan eksekusi jika token tidak ada
    }

    // Berusaha mengambil cerita dari API, dengan opsi fallback ke data offline
    await this._fetchStoriesWithFallback(userToken);
  }

  // Metode privat untuk mengambil cerita dari API atau IndexedDB
  async _fetchStoriesWithFallback(token) {
    try {
      // Mencoba mengambil daftar cerita dari layanan API
      const { listStory } = await this.model.getAllStories(token);
      this.view.renderStories(listStory); // Menampilkan cerita yang berhasil didapatkan
    } catch (networkError) {
      // Jika terjadi kegagalan jaringan atau API, coba dari penyimpanan lokal
      console.error(
        "Gagal mengambil cerita dari API, mencoba memuat dari cache lokal:",
        networkError,
      );
      await this._retrieveStoriesFromOfflineStorage();
    }
  }

  // Metode privat untuk mendapatkan cerita dari IndexedDB
  async _retrieveStoriesFromOfflineStorage() {
    try {
      const offlineEntries = await IndexedDBService.getAllStories();
      if (offlineEntries.length > 0) {
        this.view.showAlert(
          "Tidak dapat terhubung ke server. Menampilkan konten dari penyimpanan offline.",
        );
        this.view.renderStories(offlineEntries); // Menampilkan cerita dari IndexedDB
      } else {
        // Jika tidak ada data baik dari API maupun penyimpanan offline
        this.view.showAlert(
          "Gagal memuat cerita. Periksa sambungan internet Anda atau coba lagi nanti.",
        );
      }
    } catch (databaseError) {
      console.error("Kesalahan saat memuat cerita dari IndexedDB:", databaseError);
      this.view.showAlert("Terjadi masalah saat mengakses data tersimpan di perangkat.");
    }
  }

  // Metode init (ditinggalkan untuk kompatibilitas, panggil startLoadingStories)
  async init() {
    await this.startLoadingStories();
  }
}