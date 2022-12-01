const { sample } = require("lodash");

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
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
      ...options,
    });

    return response.data;
  }

  async get(url, params, options) {
    return await this.request(url, "get", { params, ...options });
  }

  async post(url, data, options) {
    const urlParams = new URLSearchParams(data);
    return await this.request(url, "post", {
      data: urlParams.toString(),
      ...options,
    });
  }

  async memes() {
    return (await this.get("get_memes")).data.memes;
  }

  async createMeme(id, { captions, font, maxFontSize }) {
    const data = {
      template_id: id,
      username: this.username,
      password: this.password,
      ...Object.assign(
        ...captions.map((caption, i) => ({
          [`boxes[${i}][text]`]: caption.toUpperCase(),
        }))
      ),
    };

    if (font != null) {
      data.font = font;
    }

    if (maxFontSize != null) {
      data.max_font_size = maxFontSize;
    }

    const response = await this.post("caption_image", data);

    return response.data.url;
  }

  async randomMeme(maxBoxes) {
    const allMemes = await this.memes();
    return sample(allMemes.filter((meme) => meme.box_count <= (maxBoxes || 2)));
  }
}

module.exports.default = Imgflip;
