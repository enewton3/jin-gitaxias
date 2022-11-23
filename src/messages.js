const { sendBombMsgToDB, bombComboToDB } = require("./firebase-utils");
const {
  timeSinceFourTwenty,
  getNiceDate,
  getNiceTime,
  isFourTwenty,
} = require("./time-utils");

const handleBombMessage = (msg) => {
  const msgCreatedDateTime = new Date(msg.createdTimestamp);
  const dataToSend = {
    discordTimestamp: msg.createdTimestamp,
    author: msg.author.username,
    content: msg.content,
    niceDate: getNiceDate(msg.createdTimestamp),
    niceTime: getNiceTime(msg.createdTimestamp),
    isFourTwenty: isFourTwenty(msg.createdTimestamp),
  };
  console.log(dataToSend);
  sendBombMsgToDB(dataToSend, msg.author.username);

  if (dataToSend.isFourTwenty) {
    bombComboToDB();
  }

  if (!dataToSend.isFourTwenty) {
    msg.react("🪦");
    msg.reply(`Oop, You were ${timeSinceFourTwenty(msgCreatedDateTime)} late`);
  }
};

module.exports = { handleBombMessage };
