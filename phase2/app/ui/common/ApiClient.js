// app/ui/common/ApiClient.js
/**
 * Simple wrapper around fetch for JSON APIs.
 */
const BASE_API_URL = "http://localhost:3000/api";

export default class ApiClient {
  /**
   * Perform a GET request.
   * @param {string} endpoint – Path after the base URL (e.g. "/courses")
   * @returns {Promise<Response>}
   */
  static async fetchGet(endpoint) {
    return fetch(`${BASE_API_URL}${endpoint}`);
  }

  /**
   * Perform a POST request with a JSON payload.
   * @param {string} endpoint – Path after the base URL
   * @param {object} body     – Data to serialize as JSON
   * @returns {Promise<Response>}
   */
  static async fetchPost(endpoint, body) {
    return fetch(`${BASE_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  /**
   * Perform a PATCH request with a JSON payload.
   * @param {string} endpoint – Path after the base URL
   * @param {object} body     – Data to serialize as JSON
   * @returns {Promise<Response>}
   */
  static async fetchPatch(endpoint, body) {
    return fetch(`${BASE_API_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  /**
   * Perform a DELETE request with a JSON payload.
   * @param {string} endpoint – Path after the base URL
   * @param {object} body     – Data to serialize as JSON
   * @returns {Promise<Response>}
   */
  static async fetchDelete(endpoint, body) {
    return fetch(`${BASE_API_URL}${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}
