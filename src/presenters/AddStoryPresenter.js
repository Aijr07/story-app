import StoryModel from "../models/StoryModel.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.capturedFromCamera = false;
    this.selectedCoords = null;
  }

  // Metode untuk menginisialisasi peta dan event listener-nya
  initMap() {
    // Koordinat default: Jakarta, Indonesia
    const defaultCoords = [-6.2, 106.816666];
    const map = L.map("map").setView(defaultCoords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let mapMarker; // Menggunakan nama yang lebih spesifik untuk marker peta

    // Menambahkan event listener untuk klik peta
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.selectedCoords = { lat, lon: lng };

      if (mapMarker) {
        mapMarker.setLatLng(e.latlng);
      } else {
        mapMarker = L.marker(e.latlng).addTo(map);
      }
      this.view.showAlert(`Lokasi dipilih: Lat ${lat.toFixed(4)}, Lon ${lng.toFixed(4)}`); // Notifikasi lokasi
    });
  }

  // Metode untuk menangani pengambilan foto dari kamera
  capturePhoto() {
    this.view.captureToCanvas();
    this.capturedFromCamera = true;
    this.view.stopCamera(); // Menghentikan aliran kamera setelah foto diambil
  }

  // Metode untuk menangani pengiriman formulir cerita
  async handleFormSubmit(e) {
    e.preventDefault(); // Mencegah perilaku default formulir

    const authToken = this.model.getToken();
    if (!authToken) {
      this.view.showAlert("Anda harus masuk terlebih dahulu!"); 
      this.view.stopCamera();
      this.view.redirectToLogin();
      return;
    }

    const { description, photo } = this.view.getFormData();
    const storyFormData = new FormData();
    storyFormData.append("description", description);

    let imageFileToSend;

    // Menentukan sumber gambar (dari kamera atau file input)
    if (this.capturedFromCamera) {
      imageFileToSend = await this.view.canvasToBlob();
      storyFormData.append("photo", imageFileToSend, "captured_story.jpg"); // Nama file diubah
    } else if (photo && photo.size > 0) {
      if (photo.size > 1000000) {
        this.view.showAlert("Ukuran gambar melebihi batas! Maksimal 1MB."); 
        return;
      }
      storyFormData.append("photo", photo);
    } else {
      this.view.showAlert("Mohon unggah atau ambil gambar cerita!"); 
      return;
    }

    // Mendapatkan lokasi (dari peta atau geolokasi browser)
    try {
      const coordinates = this.selectedCoords || (await this.view.getUserLocation());
      if (coordinates) {
        storyFormData.append("lat", coordinates.lat);
        storyFormData.append("lon", coordinates.lon);
      }
    } catch (locationError) {
      console.warn("Gagal mendapatkan lokasi:", locationError.message); 
      this.view.showAlert(`Peringatan: Gagal mendapatkan lokasi Anda. ${locationError.message}. Cerita akan dikirim tanpa lokasi.`); // Memberikan notifikasi tanpa menghentikan
    }

    // Mengirim cerita ke API
    try {
      const response = await this.model.addNewStory(storyFormData, authToken);
      if (!response.error) {
        this.view.showAlert("Cerita berhasil dikirim!"); 
        this.view.stopCamera();
        this.view.redirectToHome();
      } else {
        throw new Error(response.message);
      }
    } catch (submissionError) {
      console.error("Kesalahan saat mengirim cerita:", submissionError); 
      this.view.showAlert(`Terjadi kesalahan saat mengirim cerita: ${submissionError.message}`); 
    }
  }
}