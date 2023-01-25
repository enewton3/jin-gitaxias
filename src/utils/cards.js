const { EmbedBuilder } = require("discord.js");
const { manaCostToEmojiMap } = require("./emotes");

const cardType = (card) => {
  if (
    card.layout === "normal" ||
    card.layout === "meld" ||
    card.layout === "leveler" ||
    card.layout === "class" ||
    card.layout === "saga" ||
    card.layout === "scheme" ||
    card.layout === "planar" ||
    card.layout === "vanguard" ||
    card.layout === "token" ||
    card.layout === "double_faced_token" ||
    card.layout === "emblem" ||
    card.layout === "augment" ||
    card.layout === "host"
  ) {
    return "normal";
  }

  if (
    card.layout === "split" ||
    card.layout === "flip" ||
    card.layout === "adventure"
  ) {
    return "flip";
  }

  if (
    card.layout === "transform" ||
    card.layout === "modal_dfc" ||
    card.layout === "reversible_card" ||
    card.layout === "art_series"
  ) {
    return "transform";
  }
};

const oracleTextField = (text) => {
  return {
    name: "Oracle Text",
    value: manaCostToEmojiMap(text),
  };
};

const flavorTextField = (text) => {
  return {
    name: "Flavor Text",
    value: `*${manaCostToEmojiMap(text)}*`,
  };
};

const powerToughnessField = (p, t) => {
  return {
    name: "Power/Toughness",
    value: `${p}/${t}`,
    inline: true,
  };
};

loyaltyField = (loyalty) => {
  return {
    name: "Loyalty",
    value: loyalty,
    inline: true,
  };
};

const artistField = (artist) => {
  return {
    name: "Artist",
    value: `${artist}`,
    inline: true,
  };
};

const manaCostField = (manaCost) => {
  if (!manaCost || manaCost === "") return blankInlineField();
  return {
    name: "Mana Cost",
    value: `${manaCostToEmojiMap(manaCost)}`,
    inline: true,
  };
};

const blankInlineField = () => {
  return {
    name: "\u200B",
    value: "\u200B",
    inline: true,
  };
};

const blankField = () => {
  return {
    name: "\u200B",
    value: "\u200B",
  };
};

const cardEmbedBuilder = (card) => {
  let embed = new EmbedBuilder()
    .setTitle(`${card.name}`)
    .setDescription(`${card.type_line}`)
    .setURL(`${card.scryfall_uri}`);

  const textField = () => {
    const hasOracleText = card.oracle_text || !(card.oracle_text === "");
    const hasFlavorText = card.flavor_text || !(card.flavor_text === "");
    if (hasOracleText) return oracleTextField(card.oracle_text);
    if (hasFlavorText) return flavorTextField(card.flavor_text);
    return blankField();
  };

  const secondInlineField = () => {
    if (card.power) return powerToughnessField(card.power, card.toughness);
    if (card.loyalty) return loyaltyField(card.loyalty);
    return artistField(card.artist);
  };

  if (cardType(card) === "normal") {
    embed
      .addFields(
        textField(),
        manaCostField(card.mana_cost),
        blankInlineField(),
        secondInlineField()
      )
      .setImage(card.image_uris.normal);
  }

  if (cardType(card) === "flip") {
    embed.setImage(card.image_uris.normal);
    card.card_faces.forEach((face) => {
      embed.addFields({
        name: `${face.name}`,
        value: face.oracle_text,
      });
    });

    embed.addFields(manaCostField(card.mana_cost), secondInlineField);
  }

  if (cardType(card) === "transform") {
    const cardFace = card.card_faces[0];

    const cardFaceSecondInlineField = cardFace.power
      ? powerToughnessField(cardFace.power, cardFace.toughness)
      : artistField(cardFace.artist);

    embed.setImage(cardFace.image_uris.normal);
    embed.addFields(
      textField(),
      manaCostField(cardFace.mana_cost),
      cardFaceSecondInlineField
    );
  }

  embed
    .setTimestamp()
    .setFooter({ text: "Brought to you by the glorious Jin-Gitaxias." });

  return embed;
};

module.exports = {
  cardEmbedBuilder,
};
