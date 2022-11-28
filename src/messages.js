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
      `Oop, You were \n ${diff.toFormat(
        "h 'hours,\n' m 'minutes,\n' s 'seconds,\n and' S 'milliseconds\n'"
      )} ${after ? "LATE :cold_face:" : "EARLY :hot_face:"}`
    );
  }
};

module.exports = { handleBombMessage };
