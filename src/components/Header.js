import { HeaderView } from "../views/HeaderView.js";
import { HeaderPresenter } from "../presenters/HeaderPresenter.js";

// Definisikan kelas web component kustom untuk header
export default class HeaderCustom extends HTMLElement {
  // Metode yang dipanggil ketika elemen ditambahkan ke DOM
  connectedCallback() {
    // Inisialisasi tampilan (view) header, menggunakan elemen ini sebagai root
    this.view = new HeaderView(this);
    // Inisialisasi presenter header, meneruskan instance view
    this.presenter = new HeaderPresenter(this.view);
  }
}

// Daftarkan elemen kustom 'header-custom' ke browser
customElements.define("header-custom", HeaderCustom);