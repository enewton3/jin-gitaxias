const { sendBombMsgToDB, bombComboToDB } = require("./firebase-utils");
const { timeSinceFourTwenty, isFourTwenty } = require("./time-utils");

const handleBombMessage = (msg) => {
  const msgCreatedDateTime = new Date(msg.createdTimestamp);
  const dataToSend = {
    discordTimestamp: msg.createdTimestamp,
    authorId: msg.author.id,
    content: msg.content,
    messageId: msg.id,
    channelId: msg.channelId,
  };
  console.log(dataToSend);
  sendBombMsgToDB(dataToSend);

  if (isFourTwenty(dataToSend.discordTimestamp)) {
    bombComboToDB();
  } else {
    msg.react("🪦");
    msg.reply(`Oop, You were ${timeSinceFourTwenty(msgCreatedDateTime)} late`);
  }
};

module.exports = { handleBombMessage };
