const host = "http://localhost:3000/api";

export default class Requests {
  static async requestGet(url) {
    return fetch(host + url);
  }
  static async requestPost(url, data) {
    return fetch(host + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  static async requestPATCH(url, data) {
    return fetch(host + url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  static async requestDelete(url, data) {
    return fetch(host + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}
