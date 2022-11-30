const axios = require("axios").default;

const BASE_URL = "https://api.imgflip.com";

class Imgflip {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }

  async request(url, method, options) {
    const response = await axios.request({
      url,
      method,
      baseURL: BASE_URL,
      ...options,
    });

    return response.data;
  }

  async get(url, params, options) {
    return await this.request(url, "get", { params, ...options });
  }

  async post(url, data, options) {
    return await this.request(url, "post", { data, ...options });
  }

  async memes() {
    return (await this.get("get_memes")).memes;
  }

  async meme(id, { captions, font, maxFontSize }) {
    const data = {
      // eslint-disable-next-line camelcase
      template_id: id,
      username: this.username,
      password: this.password,
      ...Object.assign(
        ...captions.map((caption, i) => ({ [`boxes[${i}][text]`]: caption }))
      ),
    };

    if (font != null) {
      data.font = font;
    }

    if (maxFontSize != null) {
      // eslint-disable-next-line camelcase
      data.max_font_size = maxFontSize;
    }

    const { url } = await this.post("caption_image", data);

    return url;
  }
}

module.exports.default = Imgflip;
