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
  "{W}": { abbr: "W", textName: "White", emoji: "<:manaw:768198519319429172>", },
  "{U}": { abbr: "U", textName: "Blue", emoji: "<:manau:768198519864819742>", },
  "{B}": { abbr: "B", textName: "Black", emoji: "<:manab:768198519244587050>", },
  "{R}": { abbr: "R", textName: "Red", emoji: "<:manar:768198519651303474>", },
  "{G}": { abbr: "G", textName: "Green", emoji: "<:manag:768198519625744385>", },
  "{C}": { abbr: "C", textName: "Colorless", emoji: "<:manac:768198519353114706>", },
  "{X}": { abbr: "X", textName: "X", emoji: "<:manax:1064005337495121980>", },
  "{0}": { abbr: "0", textName: "0", emoji: "<:mana0:1064005274035298335>", },
  "{1}": { abbr: "1", textName: "1", emoji: "<:mana1:1064005275134201938>", },
  "{2}": { abbr: "2", textName: "2", emoji: "<:mana2:1064005276803538995>", },
  "{3}": { abbr: "3", textName: "3", emoji: "<:mana3:1064005839540719686>", },
  "{4}": { abbr: "4", textName: "4", emoji: "<:mana4:1064005285519302746>", },
  "{5}": { abbr: "5", textName: "5", emoji: "<:mana5:1064005840920658062>", },
  "{6}": { abbr: "6", textName: "6", emoji: "<:mana6:1064005845601484833>", },
  "{7}": { abbr: "7", textName: "7", emoji: "<:mana7:1064005847979663420>", },
  "{8}": { abbr: "8", textName: "8", emoji: "<:mana8:1064005289210298448>", },
  "{9}": { abbr: "9", textName: "9", emoji: "<:mana9:1064005850529812480>", },
  "{10}": { abbr: "10", textName: "10", emoji: "<:mana10:1064005852849246268>", },
  "{11}": { abbr: "11", textName: "11", emoji: "<:mana11:1064005291617820762>", },
  "{12}": { abbr: "12", textName: "12", emoji: "<:mana12:1064006181280030740>", },
  "{13}": { abbr: "13", textName: "13", emoji: "<:mana13:1064006182274080769>", },
  "{14}": { abbr: "14", textName: "14", emoji: "<:mana14:1064005295350747136>", },
  "{15}": { abbr: "15", textName: "15", emoji: "<:mana15:1064006184820023377>", },
  "{16}": { abbr: "16", textName: "16", emoji: "<:mana16:1064005298785890405>", },
  "{17}": { abbr: "17", textName: "17", emoji: "<:mana17:1064006186128650240>", },
  "{18}": { abbr: "18", textName: "18", emoji: "<:mana18:1064006188129337395>", },
  "{19}": { abbr: "19", textName: "19", emoji: "<:mana19:1064006189559599124>", },
  "{20}": { abbr: "20", textName: "20", emoji: "<:mana20:1064006190889173003>", },
  "{100}": { abbr: "100", textName: "100", emoji: ":mana101:1064006301618819143><:mana102:1064005302032273529", },
  "{1000000}": { abbr: "1000000", textName: "1000000", emoji: "<:mana10000001:1064006303275569263> <:mana10000002:1064006305284620308><:mana10000003:1064006306274488412> <:mana10000004:1064005305853300826>", },
  "{A}": { abbr: "A", textName: "Acorn", emoji: "<:manaa:1064006484402388992>", },
  "{S}": { abbr: "S", textName: "Snow", emoji: "<:manas:1067173548248006776>", },
  "{T}": { abbr: "T", textName: "Tap", emoji: "<:manat:1067172800617517126>", },
  "{Q}": { abbr: "Q", textName: "Untap", emoji: "<:manaq:1067202766231044197>", },
  "{P}": { abbr: "P", textName: "P mana", emoji: "<:manap:1067211160190976144>", },
  "{Y}":{ abbr: "Y", textName: "Y", emoji: "<:manay:1067233255776059402>", },
  "{Z}":{ abbr: "Z", textName: "Z", emoji: "<:manaz:1067233257340534826>", },
  "{CHAOS}": { abbr: "CHAOS", textName: "Chaos", emoji: "<:chaos:1064006493017473087>", },
  "{W/P}": { abbr: "W/P", textName: "W or P", emoji: "<:manawp:1067211164389494825>", },
  "{U/P}": { abbr: "U/P", textName: "U or P", emoji: "<:manaup:1067211163269607605>", },
  "{B/P}": { abbr: "B/P", textName: "B or P", emoji: "<:manabp:1067211156999110737>", },
  "{R/P}": { abbr: "R/P", textName: "R or P", emoji: "<:manarp:1067211161566724137>", },
  "{G/P}": { abbr: "G/P", textName: "G or P", emoji: "<:managp:1067211159171764256>", },
  "{2/W}": { abbr: "2/W", textName: "2 or W", emoji: "<:mana2w:1064005282772045824>", },
  "{2/U}": { abbr: "2/U", textName: "2 or U", emoji: "<:mana2u:1064005281652158524>", },
  "{2/B}": { abbr: "2/B", textName: "2 or B", emoji: "<:mana2b:1064005277927608365>", },
  "{2/R}": { abbr: "2/R", textName: "2 or R", emoji: "<:mana2r:1064005280142213221>", },
  "{2/G}": { abbr: "2/G", textName: "2 or G", emoji: "<:mana2g:1064005278883921950>", },
  "{W/U}": { abbr: "W/U", textName: "W or U", emoji: "<:manawu:1067212641388462130>", },
  "{W/B}": { abbr: "W/B", textName: "W or B", emoji: "<:manawb:1067212640075661352>", },
  "{U/R}": { abbr: "U/R", textName: "U or R", emoji: "<:manaur:1067212636984442943>", },
  "{U/B}": { abbr: "U/B", textName: "U or B", emoji: "<:manaub:1067212638813171792>", },
  "{B/G}": { abbr: "B/G", textName: "B or G", emoji: "<:manabg:1067212626913931267>", },
  "{B/R}": { abbr: "B/R", textName: "B or R", emoji: "<:manabr:1067212628205772902>", },
  "{R/G}": { abbr: "R/G", textName: "R or G", emoji: "<:manarg:1067212634484654122>", },
  "{R/W}": { abbr: "R/W", textName: "R or W", emoji: "<:manarw:1067212635768094741>", },
  "{G/U}": { abbr: "G/U", textName: "G or U", emoji: "<:managu:1067212630911098950>", },
  "{G/W}": { abbr: "G/W", textName: "G or W", emoji: "<:managw:1067212632286838917>", },
  "{∞}": { abbr: "Inf", textName: "Infinity", emoji: "<:manainfinity:1067226381773197422>", },
  "{½}": {abbr: "H", textName: "Half", emoji: "<:manahalf:1067569846579122266> ",},
  "{HW}": {abbr: "HW", textName: "Half White", emoji: "<:manahw:1067569946898464799>",},
  "{HR}": {abbr: "HR", textName: "Half Red", emoji: " <:manahr:1067569942955827230>",},
  "{W/B/P}": {abbr: "W/B/P", textName: "W/B/P", emoji:'<:manawbp:1067650966788255774>',},
  "{W/U/P}": {abbr: "W/U/P", textName: "W/U/P", emoji:'<:manawup:1067650958835863584>',}, 
  "{U/B/P}": {abbr: "U/B/P", textName: "U/B/P", emoji:'<:manaubp:1067650963428614225>',}, 
  "{U/R/P}": {abbr: "U/R/P", textName: "U/R/P", emoji:'<:manaurp:1067650965202796634>',}, 
  "{B/G/P}": {abbr: "B/G/P", textName: "B/G/P", emoji:'<:manabgp:1067650890342879382>',}, 
  "{B/R/P}": {abbr: "B/R/P", textName: "B/R/P", emoji:'<:manabrp:1067650893090144256>',}, 
  "{R/G/P}": {abbr: "R/G/P", textName: "R/G/P", emoji:'<:manargp:1067650899796840518>',}, 
  "{R/W/P}": {abbr: "R/W/P", textName: "R/W/P", emoji:'<:manarwp:1067650952993189928>',}, 
  "{G/U/P}": {abbr: "G/U/P", textName: "G/U/P", emoji:'<:managup:1067650894168076359>',}, 
  "{G/W/P}": {abbr: "G/W/P", textName: "G/W/P", emoji:'<:managwp:1067650898374971554>',},
};

//need phreyxian dual mana

const manaCostToEmojiMap = (manaCost) => {
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
