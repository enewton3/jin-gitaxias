const axios = require("axios").default;

const BASE_URL = "https://api.scryfall.com";

const colors = { W: "White", U: "Blue", B: "Black", R: "Red", G: "Green" };

class Scryfall {
  async request(url, method, options) {
    try {
      const response = await axios.request({
        url,
        method,
        baseURL: BASE_URL,
        headers: { Accept: "application/json", "Accept-Encoding": "identity" },
        ...options,
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }

  async get(url, params, options) {
    return await this.request(url, "get", { params, ...options });
  }

  //Deck Idea Generator
  // I.E. WU Vampire Vehicles Tribal

  async getRandomCard() {
    const response = await this.get(`/cards/random`);
    return response;
  }

  async getRandomCommander() {
    const urlParams = new URLSearchParams({ q: encodeURI("is:commander") });
    const response = await this.get("/cards/random", urlParams);
    return response;
  }
}

module.exports.default = Scryfall;
