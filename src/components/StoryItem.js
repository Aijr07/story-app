import IndexedDBService from "../services/IndexedDBService.js"; 

class StoryItem extends HTMLElement {
  constructor() {
    super();
    this._story = null;
    this._onSaveCallback = null;
  }

  // Metode untuk mengatur data cerita dan callback, lalu merender dan menambahkan event listener
  setStory(story, onSaveCallback) {
    this._story = story;
    this._onSaveCallback = onSaveCallback;
    this.render();
    this._attachEventListeners(); 
  }

  // Metode untuk merender tampilan kartu cerita
  render() {
    if (!this._story) {
      this.innerHTML = "<p>Data cerita tidak tersedia.</p>"; 
      return;
    }

    this.innerHTML = `
      <article class="story-card-container border rounded-lg overflow-hidden shadow bg-white p-4 cursor-pointer">
        <img src="${this._story.photoUrl}" alt="Gambar cerita oleh ${this._story.name}" class="w-full h-48 object-cover rounded-md mb-3" />
        <div class="story-info">
          <p class="text-sm text-green-600 mb-3">${this._story.description}</p>
          <h2 class="font-semibold text-lg text-green-800 mb-1">${this._story.name}</h2>
          <div class="story-actions flex gap-2 mt-3">
            <button class="save-story-btn bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50">
              Simpan Cerita
            </button>
            <button class="delete-story-btn bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 hidden">
              Hapus dari Lokal
            </button>
          </div>
        </div>
      </article>
    `;
    this._refreshButtonStatus(); // Mengubah nama agar lebih jelas
  }

  // Metode privat untuk menambahkan event listener ke elemen-elemen
  _attachEventListeners() {
    const saveButton = this.querySelector(".save-story-btn");
    const deleteButton = this.querySelector(".delete-story-btn"); // Ambil elemen delete di sini
    const cardContainer = this.querySelector(".story-card-container");

    if (saveButton) {
      saveButton.addEventListener("click", async (event) => {
        event.stopPropagation(); // Mencegah event click menyebar ke card container
        if (this._onSaveCallback) {
          await this._onSaveCallback(this._story);
          alert(`Kisah "${this._story.name}" telah berhasil disimpan!`); 
          this._refreshButtonStatus();
        }
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        event.stopPropagation(); // Mencegah event click menyebar
        await IndexedDBService.deleteStory(this._story.id); // Langsung gunakan IndexedDBService
        alert(`Kisah "${this._story.name}" telah dihapus dari penyimpanan perangkat.`); 
        this._refreshButtonStatus();
      });
    }

    if (cardContainer) {
      cardContainer.addEventListener("click", () => {
        window.location.hash = `#/detail/${this._story.id}`;
      });

      cardContainer.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          window.location.hash = `#/detail/${this._story.id}`;
        }
      });
    }
  }

  // Metode privat untuk memperbarui status tombol Simpan/Hapus
  async _refreshButtonStatus() {
    const savedStory = await IndexedDBService.getStoryById(this._story.id); // Langsung gunakan IndexedDBService
    const saveButton = this.querySelector(".save-story-btn");
    const deleteButton = this.querySelector(".delete-story-btn");

    if (saveButton) {
      if (savedStory) {
        saveButton.textContent = "Sudah Disimpan"; 
        saveButton.disabled = true;
        saveButton.classList.remove("bg-green-700", "hover:bg-green-600", "focus:ring-green-700");
        saveButton.classList.add("bg-gray-400", "cursor-not-allowed");
      } else {
        saveButton.textContent = "Simpan Cerita";
        saveButton.disabled = false;
        saveButton.classList.add("bg-green-700", "hover:bg-green-600", "focus:ring-green-700");
        saveButton.classList.remove("bg-gray-400", "cursor-not-allowed");
      }
    }

    if (deleteButton) {
      if (savedStory) {
        deleteButton.classList.remove("hidden");
      } else {
        deleteButton.classList.add("hidden");
      }
    }
  }
}

customElements.define("story-item", StoryItem);