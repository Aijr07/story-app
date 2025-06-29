import HomePresenter from "../presenters/HomePresenter.js";
import IndexedDBService from "../services/IndexedDBService.js";
import "../components/StoryItem.js";

export default class HomeView {
  constructor(container) {
    this.container = container;
    this.presenter = new HomePresenter(this);
    // Langsung panggil render saat instance dibuat
    this.render();
  }

  // Metode untuk merender struktur dasar halaman Home
  render() {
    this.container.innerHTML = `
      <main id="main-content" class="container mx-auto py-8">
        <h1 class="text-7xl font-bold text-center mb-6 text-green-800">List Cerita</h1>
        <section aria-label="Daftar cerita" id="storyList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4"></section>
      </main>
    `;
    // Inisialisasi presenter setelah elemen DOM tersedia
    this.presenter.init();
  }

  // Metode untuk menampilkan daftar cerita
  renderStories(stories) {
    const storyList = this.container.querySelector("#storyList");
    storyList.innerHTML = ""; // Bersihkan daftar sebelumnya

    if (stories.length === 0) {
      storyList.innerHTML =
        '<p class="text-center text-green-500 col-span-full">Tidak ada cerita untuk ditampilkan.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyItemElement = document.createElement("story-item");
      storyItemElement.setStory(story, async (storyToSave) => {
        try {
          await IndexedDBService.addStory(storyToSave);
        } catch (error) {
          console.error("Gagal menyimpan story ke IndexedDB:", error);
          this.showAlert("Gagal menyimpan cerita: " + error.message);
        }
      });
      storyList.appendChild(storyItemElement);
    });
  }

  // Metode untuk menampilkan pesan peringatan
  showAlert(message) {
    alert(message);
  }

  // Metode untuk mengarahkan pengguna ke halaman login
  redirectToLogin() {
    window.location.hash = "#/login";
  }
}