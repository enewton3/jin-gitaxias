const axios = require("axios").default;

const BASE_URL = "https://api.scryfall.com";

const colors = { W: "White", U: "Blue", B: "Black", R: "Red", G: "Green" };

class Scryfall {
  async request(url, method, options) {
    const response = await axios.request({
      url,
      method,
      baseURL: BASE_URL,
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
      ...options,
    });
    return response.data;
  }

  async get(url, params, options) {
    const response = await this.request(url, "get", { params, ...options });
    return response;
  }

  //Deck Idea Generator
  // I.E. WU Vampire Vehicles Tribal

  async getRandomCard() {
    try {
      const response = await this.get(`/cards/random`);
      return response;
    } catch (e) {
      return { status: e.response.status, message: e.response.data.details };
    }
  }

  async getRandomCommander() {
    const urlParams = new URLSearchParams({ q: "is:commander" });
    try {
      const response = await this.get("/cards/random", urlParams);
      return response;
    } catch (e) {
      return { status: e.response.status, message: e.response.data.details };
    }
  }

  async getCard(cardName) {
    let paramsString = `${cardName} include:extras`;

    const urlParams = new URLSearchParams({ q: paramsString });
    try {
      const response = await this.get("/cards/search", urlParams);
      return response.data[0];
    } catch (e) {
      return { status: e.response.status, message: e.response.data.details };
    }
  }
}

module.exports.default = Scryfall;
