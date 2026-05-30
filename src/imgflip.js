const { sample } = require("lodash");

const BASE_URL = "https://api.imgflip.com";

class Imgflip {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }

  async request(url, method, options) {
    const { params, data, headers, ...restOptions } = options || {};
    const requestUrl = new URL(url, `${BASE_URL}/`);

    if (params != null) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
          requestUrl.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(requestUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      body: data,
      ...restOptions,
    });

    return await response.json();
  }

  async get(url, params, options) {
    return await this.request(url, "get", { params, ...options });
  }

  async post(url, data, options) {
    const urlParams = new URLSearchParams(data);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(options?.headers || {}),
    };

    return await this.request(url, "post", {
      data: urlParams.toString(),
      ...options,
      headers,
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
