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
//prettier-ignore
const manaColorMap = {
  "{W}": { abbr: "W", textName: "White", emoji: ":manaw:", emojiId: "768198519319429172", },
  "{U}": { abbr: "U", textName: "Blue", emoji: ":manau:", emojiId: "768198519864819742", },
  "{B}": { abbr: "B", textName: "Black", emoji: ":manab:", emojiId: "768198519244587050", },
  "{R}": { abbr: "R", textName: "Red", emoji: ":manar:", emojiId: "768198519651303474", },
  "{G}": { abbr: "G", textName: "Green", emoji: ":manag:", emojiId: "768198519625744385", },
  "{C}": { abbr: "C", textName: "Colorless", emoji: ":manac:", emojiId: "768198519353114706", },
  "{X}": { abbr: "X", textName: "X", emoji: ":manax:", emojiId: "", },
  "{0}": { abbr: "0", textName: "0", emoji: ":mana0:", emojiId: "1064005274035298335", },
  "{1}": { abbr: "1", textName: "1", emoji: ":mana1:", emojiId: "1064005275134201938", },
  "{2}": { abbr: "2", textName: "2", emoji: ":mana2:", emojiId: "1064005276803538995", },
  "{3}": { abbr: "3", textName: "3", emoji: ":mana3:", emojiId: "1064005839540719686", },
  "{4}": { abbr: "4", textName: "4", emoji: ":mana4:", emojiId: "1064005285519302746", },
  "{5}": { abbr: "5", textName: "5", emoji: ":mana5:", emojiId: "1064005840920658062", },
  "{6}": { abbr: "6", textName: "6", emoji: ":mana6:", emojiId: "1064005845601484833", },
  "{7}": { abbr: "7", textName: "7", emoji: ":mana7:", emojiId: "1064005847979663420", },
  "{8}": { abbr: "8", textName: "8", emoji: ":mana8:", emojiId: "1064005289210298448", },
  "{9}": { abbr: "9", textName: "9", emoji: ":mana9:", emojiId: "1064005850529812480", },
  "{10}": { abbr: "10", textName: "10", emoji: ":mana10:", emojiId: "1064005852849246268", },
  "{11}": { abbr: "11", textName: "11", emoji: ":mana11:", emojiId: "1064005291617820762", },
  "{12}": { abbr: "12", textName: "12", emoji: ":mana12:", emojiId: "1064006181280030740", },
  "{13}": { abbr: "13", textName: "13", emoji: ":mana13:", emojiId: "1064006182274080769", },
  "{14}": { abbr: "14", textName: "14", emoji: ":mana14:", emojiId: "1064005295350747136", },
  "{15}": { abbr: "15", textName: "15", emoji: ":mana15:", emojiId: "1064006184820023377", },
  "{16}": { abbr: "16", textName: "16", emoji: ":mana16:", emojiId: "1064005298785890405", },
  "{17}": { abbr: "17", textName: "17", emoji: ":mana17:", emojiId: "1064006186128650240", },
  "{18}": { abbr: "18", textName: "18", emoji: ":mana18:", emojiId: "1064006188129337395", },
  "{19}": { abbr: "19", textName: "19", emoji: ":mana19:", emojiId: "1064006189559599124", },
  "{20}": { abbr: "20", textName: "20", emoji: ":mana20:", emojiId: "1064006190889173003", },
};

const manaCostToEmojiMap = (manaCost) => {
  manaCost = manaCost.replace(
    /{W}|{U}|{B}|{R}|{G}|{[0-9]+}|{X}/gi,
    function (matched) {
      return `<${manaColorMap[matched].emoji}${manaColorMap[matched].emojiId}>`;
    }
  );
  return manaCost;
};
module.exports = {
  emojis,
  bombEmojis,
  bombEmojiIdMap,
  bombTimezones,
  getBombMatches,
  isSlinnVoda,
  getTimezoneForEmoji,
  manaCostToEmojiMap,
};
