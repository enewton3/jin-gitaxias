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

const bombEmojiIdMap = {
  ":bombisland:": "1006674161827065856",
  ":massbomb:": "883447400373559316",
  ":calibomb:": "843631814581157909",
  ":connectibomb:": "947968133954691082",
  ":kentuckybombedchicken:": "937112959522574366",
  ":nanbomb:": "959186527575998485",
  ":nebomba:": "940724169321111562",
  ":texbomb:": "968592171127160832",
  ":thebombapple:": "937103388582219866",
  ":hawaiibomb:": "1035741691916861501",
  ":bombedalaska:": "1025925115155857438",
};

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
  bombEmojiIdMap,
  bombTimezones,
  getBombMatches,
  isSlinnVoda,
  getTimezoneForEmoji,
};
