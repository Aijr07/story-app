import ApiService from "../services/ApiService.js";

export default class AuthModel {
  // Metode untuk memeriksa apakah pengguna telah terotentikasi (memiliki token)
  isAuthenticated() {
    return !!this.getToken();
  }

  // Metode untuk mendapatkan token otentikasi dari penyimpanan lokal
  getToken() {
    return localStorage.getItem("token");
  }

  // Metode untuk menyimpan token otentikasi ke penyimpanan lokal
  saveToken(token) {
    localStorage.setItem("token", token);
  }

  // Metode untuk menghapus token otentikasi dari penyimpanan lokal
  removeToken() {
    localStorage.removeItem("token");
  }

  // Metode untuk melakukan proses login melalui API
  async login(email, password) {
    return ApiService.login({ email, password });
  }

  // Metode untuk melakukan proses registrasi pengguna baru melalui API
  async register(name, email, password) {
    return ApiService.register({ name, email, password });
  }
}