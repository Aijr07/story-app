import HomeView from "../views/HomeView.js";
import AddStoryView from "../views/AddStoryView.js";
import LoginView from "../views/LoginView.js";
import RegisterView from "../views/RegisterView.js";

export default class Router {
  // Simpan rute aplikasi dalam sebuah properti statis untuk akses mudah
  static routes = {
    "": HomeView,
    "#/": HomeView,
    "#/add": AddStoryView,
    "#/login": LoginView,
    "#/register": RegisterView,
  };

  constructor(container) {
    this.container = container;
    this._initializeListeners(); // Panggil metode inisialisasi pendengar
  }

  // Metode privat untuk menyiapkan pendengar event
  _initializeListeners() {
    window.addEventListener("hashchange", this.render.bind(this));
    window.addEventListener("load", this.render.bind(this));
  }

  // Metode utama untuk merender tampilan berdasarkan hash URL
  async render() {
    const currentHash = window.location.hash;

    // Definisikan fungsi untuk memuat dan menampilkan tampilan
    const displayView = async () => {
      // Tangani rute detail cerita secara spesifik
      if (currentHash.startsWith("#/detail/")) {
        const id = currentHash.split("/")[2];
        const DetailModule = await import("../components/Detail.js");
        new DetailModule.default(this.container, id);
        return;
      }

      // Ambil kelas tampilan dari rute yang telah ditentukan, default ke HomeView
      const TargetViewClass = Router.routes[currentHash] || HomeView;
      new TargetViewClass(this.container);
    };

    // Gunakan View Transitions API untuk transisi yang mulus jika didukung
    if (document.startViewTransition) {
      document.startViewTransition(() => displayView());
    } else {
      // Fallback biasa jika View Transitions API tidak tersedia
      await displayView();
    }
  }
}