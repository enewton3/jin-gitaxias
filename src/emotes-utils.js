const { MessageReaction } = require("discord.js");

const bombEmotes = [
  ":bomb:",
  ":bombisland:",
  ":massbomb:",
  ":calibomb:",
  ":connectibomb:",
  ":kentuckybombedchicken:",
  ":nanbomb:",
  ":nebomba:",
  ":texbomb:",
  ":thebombapple:",
];

const emotes = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

const includesBomb = (msg) => {
  const included = bombEmotes.filter((emote) =>
    msg.includes(emote) ? emote : null
  );
  if (included.length > 0) {
    return true;
  }
  return false;
};

const isSlinnVoda = (reaction) => {
  return reaction === "slinnvodapoint";
};

module.exports = {
  emotes,
  includesBomb,
  isSlinnVoda,
};
