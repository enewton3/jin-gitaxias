const { sendBombMsgToDB, bombComboToDB } = require("./firebase-utils");
const { isFourTwenty, calculateFourTwentyProximity } = require("./time-utils");

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
    bombComboToDB();
  } else {
    msg.react("🪦");

    const { diff, after } = calculateFourTwentyProximity(
      msg.createdTimestamp,
      timezone
    );

    msg.reply(
      `Oop, You were  ${diff.toFormat(
        "h 'hours,' m 'minutes,' s 'seconds, and' S 'milliseconds'"
      )} ${after ? "LATE :cold_face:" : "EARLY :hot_face:"}`
    );
  }
};

module.exports = { handleBombMessage };
