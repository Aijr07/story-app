export default class DetailView {
  constructor(container, onRedirect) {
    this.container = container;
    // fungsi callback
    this.onRedirect = onRedirect;
  }

  // Metode untuk memicu callback redirect
  triggerRedirect() {
    this.onRedirect?.();
  }

  // Metode untuk merender tampilan kesalahan
  renderError(message) {
    this.container.innerHTML = `<p class="text-green-800">Gagal memuat detail cerita: ${message}</p>`;
  }

  // Metode untuk menginisialisasi peta
  initMap(lat, lon) {
    const map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup("Lokasi cerita ini").openPopup();
  }

  // Metode utama untuk merender detail cerita
  renderStory(story) {
    this.container.innerHTML = `
      <article class="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4" role="main" aria-labelledby="storyTitle">
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" class="w-full h-64 object-cover rounded">
        <p class="text-green-700">Dibuat : ${new Date(story.createdAt).toLocaleDateString()}</p>
        <h1 id="storyTitle" class="text-xl font-bold text-green-900">${story.name}</h1>
        <p class="text-green-700">${story.description}</p>
        <p class="text-sm text-green-600" aria-label="Koordinat lokasi cerita">Lat: ${story.lat}, Lon: ${story.lon}</p>
        <section id="map" class="w-full h-64 rounded border border-green-800" role="region" aria-label="Peta lokasi cerita"></section>
      </article>
    `;

    this.initMap(story.lat, story.lon);
  }
}