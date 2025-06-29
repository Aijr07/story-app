export default class ApiService {
  static baseUrl = "https://story-api.dicoding.dev/v1";

  static async request(
    endpoint,
    method = "GET",
    body = null,
    token = null,
    isForm = false,
  ) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!isForm) headers["Content-Type"] = "application/json";

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: isForm ? body : body && JSON.stringify(body),
    });

    return res.json();
  }

  static register(data) {
    return this.request("/register", "POST", data);
  }

  static login(data) {
    return this.request("/login", "POST", data);
  }

  static getStories(token) {
    return this.request("/stories?location=1", "GET", null, token);
  }

  static addStory(formData, token) {
    return this.request("/stories", "POST", formData, token, true);
  }

  static getSubscribed(token, endpoint, keys) {
    return fetch(`${this.baseUrl}/notifications/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      }),
    });
  }

  static getUnsubscribe(token, endpoint) {
    return fetch(`${this.baseUrl}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });
  }
}
