import AuthPresenter from "../presenters/AuthPresenter.js";
import AuthModel from "../models/AuthModel.js";

export default class RegisterView {
  constructor(container) {
    this.container = container;
    const model = new AuthModel();
    this.presenter = new AuthPresenter(this, model);
    this.render();
  }

  // Metode utama untuk merender tampilan register
  render() {
    this.container.innerHTML = `
      <section class="p-4 max-w-lg mx-auto flex justify-center items-center flex-col min-h-screen bg-green-50 rounded-lg shadow-lg" role="main" aria-labelledby="registerTitle">
        <h2 id="registerTitle" class="text-3xl font-bold mb-6 text-green-800">Daftar Akun Baru</h2>
        <form id="registerForm" class="space-y-5 w-full flex flex-col" aria-describedby="errorMsg">
          <div>
            <label for="name" class="block text-lg font-medium text-green-700 mb-1">Nama</label>
            <input type="text" id="name" name="name" class="border border-green-300 p-3 w-full rounded-md focus:ring-green-500 focus:border-green-500" required aria-required="true" aria-label="Masukkan nama Anda" placeholder="Nama Lengkap" />
          </div>

          <div>
            <label for="email" class="block text-lg font-medium text-green-700 mb-1">Email</label>
            <input type="email" id="email" name="email" class="border border-green-300 p-3 w-full rounded-md focus:ring-green-500 focus:border-green-500" required aria-required="true" aria-label="Masukkan email Anda" placeholder="email@example.com" />
          </div>

          <div>
            <label for="password" class="block text-lg font-medium text-green-700 mb-1">Password</label>
            <input type="password" name="password" id="password" class="border border-green-300 p-3 w-full rounded-md focus:ring-green-500 focus:border-green-500" required aria-required="true" aria-label="Masukkan kata sandi Anda" placeholder="******" />
          </div>

          <button type="submit" class="bg-green-800 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out font-semibold text-lg" aria-label="Tombol daftar">Daftar</button>
          <p id="errorMsg" class="text-red-600 mt-3 text-center" role="alert" aria-live="assertive"></p>
        </form>
      </section>
    `;

    // Ambil elemen setelah dirender dan tambahkan event listener
    const nameInput = this.container.querySelector("#name");
    const registerForm = this.container.querySelector("#registerForm");

    if (nameInput) {
      nameInput.focus();
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const email = this.container.querySelector("#email").value;
        const password = this.container.querySelector("#password").value;
        this.presenter.register(name, email, password);
      });
    }
  }

  // Metode yang dipanggil saat registrasi berhasil
  onRegisterSuccess() {
    alert("Registrasi berhasil! Silakan login.");
    window.location.hash = "#/login";
  }

  // Metode untuk menampilkan pesan error
  showError(message) {
    const errorMsgElement = this.container.querySelector("#errorMsg");
    if (errorMsgElement) {
      errorMsgElement.textContent = message;
    }
  }
}