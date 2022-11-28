const { sendBombMsgToDB, bombComboToDB } = require("./firebase-utils");
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

const handleBombMessage = (msg, timezone) => {
  const dataToSend = {
    discordTimestamp: msg.createdTimestamp,
    authorId: msg.author.id,
    content: msg.content,
    messageId: msg.id,
    channelId: msg.channelId,
  };
  console.log(dataToSend);
  sendBombMsgToDB(dataToSend);

  if (isFourTwenty(msg.createdTimestamp, timezone)) {
    bombComboToDB(msg.createdTimestamp, timezone);
  } else {
    msg.react("🪦");

    const { diff, after } = calculateFourTwentyProximity(
      msg.createdTimestamp,
      timezone
    );

    const obnoxiousRegex = new RegExp(Object.keys(numbersTM).join("|"), "gi");

    const replyMsg = `Oop :open_mouth:\n You were:\n\n  ${diff.toFormat(
      "h 'hours,\n\n'  m 'minutes,\n\n'  s 'seconds,\n\n  and' S 'milliseconds\n\n'"
    )}  ${after ? "LATE :cold_face:" : "EARLY :hot_face:"}`;

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
