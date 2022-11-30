const { MessageReaction } = require("discord.js");

const bombEmotes = [
  [":bomb:", null],
  [":bombisland:", "America/New_York"],
  [":massbomb:", "America/New_York"],
  [":calibomb:", "America/Los_Angeles"],
  [":connectibomb:", "America/New_York"],
  [":kentuckybombedchicken:", "America/New_York"],
  [":nanbomb:", "America/New_York"],
  [":nebomba:", "America/Los_Angeles"],
  [":texbomb:", "America/Chicago"],
  [":thebombapple:", "America/New_York"],
  [":hawaiibomb:", "Pacific/Honolulu"],
  [":bombedalaska:", "America/Anchorage"],
];

const bombTimezones = new Set(
  bombEmotes.map(([, timezone]) => timezone || "America/New_York")
);

const emotes = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

const getBombMatches = (msgContent) =>
  bombEmotes.filter(([emote]) => msgContent.includes(emote));

const isSlinnVoda = (reaction) => reaction === "slinnvodapoint";

module.exports = {
  emotes,
  bombEmotes,
  bombTimezones,
  getBombMatches,
  isSlinnVoda,
};
