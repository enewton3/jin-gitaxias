const bombEmojis = [
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
  bombEmojis.map(([, timezone]) => timezone || "America/New_York")
);

const emojis = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

const getBombMatches = (msgContent) =>
  bombEmojis
    .filter(([emoji]) => msgContent.includes(emoji))
    .map(([emoji]) => emoji);

const getTimezoneForEmoji = (emoji) =>
  bombEmojis.find(([bombEmoji]) => emoji === bombEmoji)[1];

const isSlinnVoda = (reaction) => reaction === "slinnvodapoint";

module.exports = {
  emojis,
  bombEmojis,
  bombTimezones,
  getBombMatches,
  isSlinnVoda,
  getTimezoneForEmoji,
};
