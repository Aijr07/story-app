import StoryModel from "../models/StoryModel.js";
import AuthModel from "../models/AuthModel.js";

export default class DetailPresenter {
  constructor(view, storyId) {
    this.view = view;
    this.storyId = storyId;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();

    // Memulai inisialisasi presenter secara otomatis saat dibuat
    this.initiateStoryLoading();
  }

  // Metode utama untuk memulai pemuatan detail cerita
  async initiateStoryLoading() {
    const userToken = this.authModel.getToken();

    // Pastikan pengguna sudah login sebelum memuat cerita
    if (!userToken) {
      this.view.triggerRedirect(); // Arahkan pengguna jika tidak ada token
      return;
    }

    // Coba ambil dan tampilkan detail cerita
    try {
      const storyDetails = await this.storyModel.getStoryById(this.storyId, userToken);
      this.view.renderStory(storyDetails); // Tampilkan cerita di tampilan
    } catch (fetchError) {
      this.view.renderError(fetchError.message); 
    }
  }
}