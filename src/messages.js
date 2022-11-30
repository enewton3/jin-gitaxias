const { DateTime } = require("luxon");
const {
  sendBombMsgToDB,
  bombComboToDB,
  isUserInCombo,
} = require("./firebase-utils");
const { isFourTwenty, calculateFourTwentyProximity } = require("./time-utils");

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

module.exports = { handleBombMessage };
