class FooterCustom extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <footer class="bg-gradient-to-r from-green-800 to-green-900 text-white py-8 px-4 mt-12 shadow-lg">
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
        <div class="flex items-center space-x-3">
          <svg class="w-7 h-7 text-green-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414L14.586 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xl font-semibold tracking-wide">StoryApp</span>
        </div>
        <p class="text-sm">
          &copy; ${new Date().getFullYear()} Peserta Dicoding.
        </p>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-sm">
          <a href="#/" class="hover:underline">Beranda</a>
          <a href="#/add" class="hover:underline">Tambahkan Cerita</a>
          <a href="#" class="hover:underline">Privasi</a>
        </div>
      </div>
    </footer>
    `;
  }
}

customElements.define("footer-custom", FooterCustom);