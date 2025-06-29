// src/presenters/DetailPresenter.js
import StoryModel from "../models/StoryModel.js";
import AuthModel from "../models/AuthModel.js";
import IndexedDBService from "../services/IndexedDBService.js"; // Pastikan ini diimpor

export default class DetailPresenter {
  constructor(view, storyId) {
    this.view = view;
    this.storyId = storyId;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();
    this.initiateStoryLoading();
  }

  async initiateStoryLoading() {
    const userToken = this.authModel.getToken();
    if (!userToken) {
      this.view.triggerRedirect();
      return;
    }

    try {
      // Coba ambil dari API terlebih dahulu
      const storyDetails = await this.storyModel.getStoryById(this.storyId, userToken);
      this.view.renderStory(storyDetails);
    } catch (apiError) {
      console.error("Gagal mengambil detail cerita dari API, mencoba dari penyimpanan offline:", apiError);
      // Jika gagal dari API, coba ambil dari IndexedDB
      try {
        const offlineStory = await IndexedDBService.getStoryById(this.storyId); // Asumsikan Anda memiliki metode ini di IndexedDBService
        if (offlineStory) {
          this.view.showAlert("Gagal terhubung ke server. Menampilkan detail cerita dari penyimpanan offline.");
          this.view.renderStory(offlineStory);
        } else {
          this.view.renderError("Detail cerita tidak ditemukan, bahkan di penyimpanan offline. Periksa koneksi internet atau simpan cerita ini saat online.");
        }
      } catch (dbError) {
        console.error("Terjadi kesalahan saat memuat detail cerita dari IndexedDB:", dbError);
        this.view.renderError("Terjadi masalah saat mengakses detail cerita offline.");
      }
    }
  }
}