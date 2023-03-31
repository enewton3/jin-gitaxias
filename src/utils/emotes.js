const bombEmojis = [
  [":bomb:", null],
  [":itsbomboclocksomewhere:", null],
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
  [":colobombo:", "America/Boise"],
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
  ":colobombo:": "1062585782335963156",
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
const manaEmojiMap = {
  "{W}": {textName: "White", emoji: "<:manaw:768198519319429172>", },
  "{U}": {textName: "Blue", emoji: "<:manau:768198519864819742>", },
  "{B}": {textName: "Black", emoji: "<:manab:768198519244587050>", },
  "{R}": {textName: "Red", emoji: "<:manar:768198519651303474>", },
  "{G}": {textName: "Green", emoji: "<:manag:768198519625744385>", },
  "{C}": {textName: "Colorless", emoji: "<:manac:768198519353114706>", },
  "{X}": {textName: "X", emoji: "<:manax:1064005337495121980>", },
  "{0}": {textName: "0", emoji: "<:mana0:1064005274035298335>", },
  "{1}": {textName: "1", emoji: "<:mana1:1064005275134201938>", },
  "{2}": {textName: "2", emoji: "<:mana2:1064005276803538995>", },
  "{3}": {textName: "3", emoji: "<:mana3:1064005839540719686>", },
  "{4}": {textName: "4", emoji: "<:mana4:1064005285519302746>", },
  "{5}": {textName: "5", emoji: "<:mana5:1064005840920658062>", },
  "{6}": {textName: "6", emoji: "<:mana6:1064005845601484833>", },
  "{7}": {textName: "7", emoji: "<:mana7:1064005847979663420>", },
  "{8}": {textName: "8", emoji: "<:mana8:1064005289210298448>", },
  "{9}": {textName: "9", emoji: "<:mana9:1064005850529812480>", },
  "{10}": {textName: "10", emoji: "<:mana10:1064005852849246268>", },
  "{A}": {textName: "Acorn", emoji: "<:manaa:1064006484402388992>", },
  "{S}": {textName: "Snow", emoji: "<:manas:1067173548248006776>", },
  "{T}": {textName: "Tap", emoji: "<:manat:1067172800617517126>", },
  "{Q}": {textName: "Untap", emoji: "<:manaq:1067202766231044197>", },
  "{P}": {textName: "P mana", emoji: "<:manap:1067211160190976144>", },
  "{Y}":{textName: "Y", emoji: "<:manay:1067233255776059402>", },
  "{Z}":{textName: "Z", emoji: "<:manaz:1067233257340534826>", },
  "{CHAOS}": {textName: "Chaos", emoji: "<:chaos:1064006493017473087>", },
  "{∞}": {textName: "Infinity", emoji: "<:manainfinity:1067226381773197422>", },
  "{½}": {textName: "Half", emoji: "<:manahalf:1067569846579122266> ",},
  "{11}": {textName: "11", emoji: "<:mana11:1070121530291404951>", },
  "{12}": {textName: "12", emoji: "<:mana12:1070121532820553869>", },
  "{13}": {textName: "13", emoji: "<:mana13:1070121533776863332>", },
  "{14}": {textName: "14", emoji: "<:mana14:1070121534775115777>", },
  "{15}": {textName: "15", emoji: "<:mana15:1070121537258143794>", },
  "{16}": {textName: "16", emoji: "<:mana16:1070121538357055538>", },
  "{17}": {textName: "17", emoji: "<:mana17:1070121539640504320>", },
  "{18}": {textName: "18", emoji: "<:mana18:1070121541456642078>", },
  "{19}": {textName: "19", emoji: "<:mana19:1070121542463275028>", },
  "{20}": {textName: "20", emoji: "<:mana20:1070121597836476486>", },
  "{100}": {textName: "100", emoji: 
    "<:mana101:1070122598689669180><:mana102:1070122600438698105>",
  },
  "{1000000}": {textName: "1000000", emoji:
      "<:mana10000001:1070122850465370122><:mana10000002:1070122852277289071><:mana10000003:1070122854181511178><:mana10000004:1070122855259439114>",
  },
  "{W/P}": {textName: "W or P", emoji: "<:manawp:1070123575513710712>", },
  "{U/P}": {textName: "U or P", emoji: "<:manaup:1070123576428085369>", },
  "{B/P}": {textName: "B or P", emoji: "<:manabp:1070123579968081980>", },
  "{R/P}": {textName: "R or P", emoji: "<:manarp:1070123578051272774>", },
  "{G/P}": {textName: "G or P", emoji: "<:managp:1070123569293557790>",},
  "{2/W}": {textName: "2 or W", emoji: "<:mana2w:1070120604826619924>", },
  "{2/U}": {textName: "2 or U", emoji: "<:mana2u:1070120601982877827>", },
  "{2/B}": {textName: "2 or B", emoji: "<:mana2b:1070120596849033217>", },
  "{2/R}": {textName: "2 or R", emoji: "<:mana2r:1070120600900743190>", },
  "{2/G}": {textName: "2 or G", emoji: "<:mana2g:1070120598430290031>", },
  "{W/U}": {textName: "W or U", emoji: "<:manawu:1070124585292410992>", },
  "{W/B}": {textName: "W or B", emoji: "<:manawb:1070124582343815248>", },
  "{U/R}": {textName: "U or R", emoji: "<:manaur:1070124580766760980>", },
  "{U/B}": {textName: "U or B", emoji: "<:manaub:1070124577994330132>", },
  "{B/G}": {textName: "B or G", emoji: "<:manabg:1070124568087384218>", },
  "{B/R}": {textName: "B or R", emoji: "<:manabr:1070124569203060898>", },
  "{R/G}": {textName: "R or G", emoji: "<:manarg:1070124574966038599>", },
  "{R/W}": {textName: "R or W", emoji: "<:manarw:1070124576564068352>", },
  "{G/U}": {textName: "G or U", emoji: "<:managu:1070124572126478406>", },
  "{G/W}": {textName: "G or W", emoji: "<:managw:1070124573435105310>", },
  "{HW}": {textName: "Half White", emoji: "<:manahw:1070124149550362705>",},
  "{HR}": {textName: "Half Red", emoji: "<:manahr:1070124147377713233>", },
  "{W/U/P}": {textName: "W/U/P", emoji:'<:manawup:1070119533697847337>',}, 
  "{W/B/P}": {textName: "W/B/P", emoji:'<:manawbp:1070119547123802245>',},
  "{U/B/P}": {textName: "U/B/P", emoji:'<:manaubp:1070119544745627699>',}, 
  "{U/R/P}": {textName: "U/R/P", emoji:'<:manaurp:1070119545626439731>',}, 
  "{B/G/P}": {textName: "B/G/P", emoji:'<:manabgp:1070119531785232525>',}, 
  "{B/R/P}": {textName: "B/R/P", emoji:'<:manabrp:1070119536042442802>',}, 
  "{R/G/P}": {textName: "R/G/P", emoji:'<:manargp:1070119540685541447>',}, 
  "{R/W/P}": {textName: "R/W/P", emoji:'<:manarwp:1070119542308753539>',}, 
  "{G/U/P}": {textName: "G/U/P", emoji:'<:managup:1070119536784838688>',}, 
  "{G/W/P}": { textName: "G/W/P", emoji: '<:managwp:1070119538538053715>', },
};

const manaCostToEmojiMap = (manaCost) => {
  if (!manaCost || manaCost === "") return "";
  const replace = new RegExp(
    "{W}|{U}|{B}|{R}|{G}|{C}|{X}|{[0-9]+}|{A}|{S}|{T}|{Q}|{P}|{Y}|{Z}|{CHAOS}|{W/P}|{U/P}|{B/P}|{R/P}|{G/P}|{2/W}|{2/U}|{2/B}|{2/R}|{2/G}|{W/U}|{W/B}|{U/R}|{U/B}|{B/G}|{B/R}|{R/G}|{R/W}|{G/U}|{G/W}|{∞}|{½}|{HW}|{HR}|{W/B/P}|{W/U/P}|{U/B/P}|{U/R/P}|{B/G/P}|{B/R/P}|{R/G/P}|{R/W/P}|{G/U/P}|{G/W/P}",
    "gim"
  );

  manaCost = manaCost.replace(replace, (matched) => {
    return manaEmojiMap[matched].emoji;
  });

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
