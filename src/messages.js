const { some, isArray, every } = require("lodash");
const { DateTime } = require("luxon");

const { getBombMatches, getTimezoneForEmoji } = require("./utils/emotes");
const {
  sendBombMsgToDB,
  bombComboToDB,
  isUserInCombo,
} = require("./utils/firebase");
const { isFourTwenty, calculateFourTwentyProximity } = require("./utils/time");

const numbersTM = {
  1: ":one:",
  2: ":two:",
  3: ":three:",
  4: ":four:",
  5: ":five:",
  6: ":six:",
  7: ":seven:",
  8: ":eight:",
  9: ":nine:",
  0: ":zero:",
};

const getReplyFormatString = (diff) => {
  const parts = [];

  if (diff.hours > 0) {
    parts.push("h 'hours'");
  }
  if (diff.minutes > 0) {
    parts.push("m 'minutes'");
  }
  if (diff.seconds > 0) {
    parts.push("s 'seconds'");
  }
  if (diff.milliseconds > 0) {
    parts.push("S 'milliseconds'");
  }

  if (parts.length === 1) {
    return parts[0];
  }

  parts[parts.length - 1] = `'and' ${parts[parts.length - 1]}`;

  if (parts.length === 2) {
    return parts.join(" ");
  }

  return parts.join(",\n\n");
};

const makeMatchingTextHandler = (callback, ...stringMatches) => {
  // string matches can be any number of arguments, each argument can be:
  // - a string, in which case it will match case insensitive
  // - an array of strings, in which case it will check if all items are in the message
  //   (regardless of order)
  return (msg) => {
    if (
      some(stringMatches, (match) => {
        if (isArray(match)) {
          return every(match, (matchStr) =>
            msg.content.toLowerCase().includes(matchStr)
          );
        } else {
          return msg.content.toLowerCase().includes(match);
        }
      })
    ) {
      callback(msg);
    }
  };
};

const maybeHandleBombMessage = (msg) => {
  let matchingEmojis = getBombMatches(msg.content);

  if (matchingEmojis.length > 1) {
    matchingEmojis = matchingEmojis.filter((emoji) => emoji !== ":bomb:");
  }

  const timezones = matchingEmojis.map((emoji) => getTimezoneForEmoji(emoji));
  const timezonesSet = new Set(timezones);

  if (timezonesSet.size > 1) {
    msg.reply("TOO MANY TUNAS");
  } else if (timezonesSet.size === 1) {
    console.log(`Handling bomb message for ${msg.author.id} `);
    handleBombMessage(msg, timezones[0], matchingEmojis[0]);
  }
};

const maybeHandleCommanderDamageMessage = makeMatchingTextHandler(
  (msg) => {
    msg.reply(`<@${process.env.TOM_ID}>`);
  },
  "commander damage",
  ["commander", "damage"]
);

const maybeHandleForgetfulMessage = makeMatchingTextHandler(
  (msg) => {
    msg.reply(process.env.FORGOT_ABOUT_DRE_URL);
  },
  "forgot",
  "forget",
  "dre"
);

const maybeHandleGoodBot = makeMatchingTextHandler(
  (msg) => {
    msg.react("<:soup:896939920223010886>");
  },
  "good bot",
  ["good", "bot"]
);

const maybeHandleJinMention = makeMatchingTextHandler((msg) => {
  msg.react("<:jinspice:812112198573883393>");
}, "jin");

const handleBombMessage = async (msg, timezone, emoji) => {
  const dataToSend = {
    discordTimestamp: msg.createdTimestamp,
    authorId: msg.author.id,
    content: msg.content,
    messageId: msg.id,
    channelId: msg.channelId,
  };
  sendBombMsgToDB(dataToSend);

  if (isFourTwenty(msg.createdTimestamp, timezone)) {
    const msgDateTime = DateTime.fromMillis(msg.createdTimestamp, {
      zone: timezone,
    });
    if (await isUserInCombo(msg.author.id, msgDateTime)) {
      msg.react("<:sensingaplot:885662119415148564>");
    } else {
      msg.react("<:slinnvodapoint:724094086323372105>");
      bombComboToDB(msg.author.id, msgDateTime, emoji);
    }
  } else {
    msg.react("🪦");

    const { diff, after } = calculateFourTwentyProximity(
      msg.createdTimestamp,
      timezone
    );

    const obnoxiousRegex = new RegExp(Object.keys(numbersTM).join("|"), "gi");

    const replyMsg = `Oop :open_mouth:\nYou were:\n\n${diff.toFormat(
      getReplyFormatString(diff)
    )}\n\n${after ? "LATE :cold_face:" : "EARLY :hot_face:"}`;

    msg.reply(
      replyMsg.replace(obnoxiousRegex, (matched) => numbersTM[matched])
    );

    // Lol gottem
    if (msg.author.id === process.env.HUNTER_ID) {
      msg.pin();
    }
  }
};

module.exports = {
  maybeHandleBombMessage,
  maybeHandleCommanderDamageMessage,
  maybeHandleForgetfulMessage,
  maybeHandleGoodBot,
  maybeHandleJinMention,
  numbersTM,
};
