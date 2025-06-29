export default class AuthPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  // Metode untuk menangani proses pendaftaran pengguna baru
  async register(name, email, password) {
    try {
      const registrationAttempt = await this.model.register(name, email, password);

      if (registrationAttempt.error) {
        throw new Error(registrationAttempt.message);
      }

      this.view.onRegisterSuccess(); 
    } catch (registrationError) {
      this.view.showError(`Gagal mendaftar: ${registrationError.message}`); 
    }
  }

  // Metode untuk menangani proses masuk pengguna
  async login(email, password) {
    try {
      const loginAttempt = await this.model.login(email, password);

      if (loginAttempt.error) {
        throw new Error(loginAttempt.message);
      }

      this.view.onLoginSuccess(loginAttempt.loginResult.token); 
    } catch (loginError) {
      this.view.showError(`Gagal masuk: ${loginError.message}`); 
    }
  }
}