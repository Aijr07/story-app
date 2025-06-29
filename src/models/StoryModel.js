export default class StoryModel {
  // Metode untuk mendapatkan token otentikasi dari penyimpanan lokal
  getToken() {
    return localStorage.getItem("token");
  }

  // Metode untuk mengambil detail cerita berdasarkan ID dari API
  async getStoryById(id, token) {
    try {
      const response = await fetch(
        `https://story-api.dicoding.dev/v1/stories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || "Gagal mendapatkan detail cerita."); // Kata-kata sedikit diubah
      }

      return data.story;
    } catch (error) {
      throw new Error(error.message || "Terjadi masalah saat mengambil detail cerita."); // Kata-kata sedikit diubah
    }
  }

  // Metode untuk mengambil semua cerita dari API
  async getAllStories(token) {
    try {
      const response = await fetch(
        "https://story-api.dicoding.dev/v1/stories",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal mengambil daftar cerita."); // Kata-kata sedikit diubah

      return data;
    } catch (error) {
      // Mengembalikan objek error yang konsisten jika terjadi masalah
      return { error: true, message: error.message };
    }
  }

  // Metode untuk menambahkan cerita baru ke API
  async addNewStory(formData, token) {
    try {
      const response = await fetch(
        "https://story-api.dicoding.dev/v1/stories",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Gagal mengirimkan cerita baru."); // Kata-kata sedikit diubah

      return data;
    } catch (error) {
      // Mengembalikan objek error yang konsisten jika terjadi masalah
      return { error: true, message: error.message };
    }
  }
}