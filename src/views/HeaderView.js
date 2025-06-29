export class HeaderView {
  constructor(rootElement) {
    this.root = rootElement;
  }

  render(isAuthenticated) {
    this.root.innerHTML = `
      <header class="bg-gradient-to-r from-green-800 to-green-900 text-white py-8 px-4 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <a
            href="#main-content"
            class="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-white focus:text-green-800 focus:p-2 focus:rounded focus:shadow-lg focus:z-50"
          >
            Lewati ke konten utama
          </a>
          <h1 class="text-2xl font-extrabold tracking-wide">
            <a href="#/" class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-green-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414L14.586 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
              </svg>
              <span>Story app</span>
            </a>
          </h1>
          <nav class="space-x-4 flex items-center">
            <button id="toggleNotifBtn" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17l-3 3m0 0l-3-3m3 3V3"></path>
              </svg>
              <span>Aktifkan Langganan</span>
            </button>
            ${
              isAuthenticated
                ? `
                <a href="#/" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 12h.01"></path>
                  </svg>
                  <span>Daftar Kisah</span>
                </a>
                <a href="#/add" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Tambah Kisah Baru</span>
                </a>
                <button id="logoutBtn" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Keluar</span>
                </button>
              `
                : `
                <a href="#/login" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Masuk</span>
                </a>
                <a href="#/register" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM5 19a2 2 0 01-2-2v-1a2 2 0 012-2h4a2 2 0 012 2v1a2 2 0 01-2 2H5z"></path>
                  </svg>
                  <span>Daftar Akun</span>
                </a>
              `
            }
          </nav>
        </div>
      </header>
    `;
  }

  bindLogout(handler) {
    const logoutBtn = this.root.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handler();
      });
    }
  }

  bindSkipLink() {
    const skipLink = this.root.querySelector(".skip-link");
    const mainContent = document.querySelector("#main-content");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        skipLink.blur();
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  notifyAuthChanged() {
    window.dispatchEvent(new Event("authChanged"));
  }

  bindNotificationToggle(handler) {
    const toggleBtn = this.root.querySelector("#toggleNotifBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        handler();
      });
    }
  }

  updateNotifButtonState(isEnabled) {
    const btn = this.root.querySelector("#toggleNotifBtn");
    if (btn) {
      const spanText = btn.querySelector('span');
      if (spanText) {
        spanText.textContent = isEnabled
          ? "Nonaktifkan Langganan" // Perubahan string
          : "Aktifkan Langganan"; // Perubahan string
      }
    }
  }
}

export default HeaderView;