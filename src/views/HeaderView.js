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
              <svg class="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3.037.56a1.5 1.5 0 00-1.151 1.15c-.18.975-.294 1.995-.294 3.037V15m12 0a8.967 8.967 0 01-6 2.292c-1.052 0-2.062-.18-3.037-.56a1.5 1.5 0 00-1.151-1.15c-.18-.975-.294-1.995-.294-3.037V9m12 9a8.967 8.967 0 006-2.292c1.052 0 2.062-.18 3.037-.56.86.326 1.15.226 1.15 1.15V9M12 6.042V15m0 0a8.967 8.967 0 01-6 2.292c-1.052 0-2.062-.18-3.037-.56a1.5 1.5 0 00-1.151-1.15c-.18-.975-.294-1.995-.294-3.037V9m12 9a8.967 8.967 0 006-2.292c1.052 0 2.062-.18 3.037-.56.86.326 1.15.226 1.15 1.15V9" />
              </svg>
              <span>StorySphere</span>
            </a>
          </h1>
          <nav class="space-x-4 flex items-center">
            <button id="toggleNotifBtn" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.022c1.733.64 3.56 1.04 5.455 1.31m5.714 0a24.238 24.238 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span>Aktifkan Langganan</span>
            </button>
            ${
              isAuthenticated
                ? `
                <a href="#/" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12V21m0-3.75h-.625a3.375 3.375 0 01-3.375-3.375V9.75m3.75 3.75V15m0 3.75h.008v.008H12m-12 3h16.5m-16.5 0l-3-3m3 3l3-3m-3-3v-2.25c0-1.036.84-1.875 1.875-1.875h1.375M12 9.75v3.75m3.75-3.75h-.008v.008h.008Z" />
                  </svg>
                  <span>Daftar Kisah</span>
                </a>
                <a href="#/add" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Tambah Kisah Baru</span>
                </a>
                <button id="logoutBtn" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Keluar</span>
                </button>
              `
                : `
                <a href="#/login" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.25 9.75v4.5m0-4.5h-2.25m4.5 0h-2.25m-6 0H3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Masuk</span>
                </a>
                <a href="#/register" class="hover:bg-green-700 p-2 rounded-md flex items-center space-x-2 transition duration-200 ease-in-out">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM5 19.5V18a2 2 0 012-2h4a2 2 0 012 2v1.5a.75.75 0 00.75.75h2.25m-10.5-.75H3a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h2.25c.338 0 .6-.262.6-.6z" />
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
          ? "Nonaktifkan Langganan"
          : "Aktifkan Langganan";
      }
    }
  }
}

export default HeaderView;