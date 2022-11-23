require("dotenv").config();

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField } = require("discord.js");
const { emotes, includesBomb } = require("./emotes-utils");
const {
  sendData,
  sendBombMsgToDB,
  getBombMsgsFromDB,
} = require("./firebase-utils");
const {
  isFourTwenty,
  getNiceTime,
  getNiceDate,
  timeSinceFourTwenty,
} = require("./time-utils");

const intents = new IntentsBitField();

intents.add(
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.MessageContent
);

const client = new Client({ intents: intents });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (includesBomb(msg.content)) {
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

    if (!dataToSend.isFourTwenty) {
      const timeSince = timeSinceFourTwenty(msgCreatedDateTime);

      let replyString = [];
      if (timeSince.hours > 0) replyString.push(`${timeSince.hours} hours`);
      if (timeSince.minutes > 0)
        replyString.push(`${timeSince.minutes} minutes`);
      if (timeSince.seconds > 0)
        replyString.push(`${timeSince.seconds} seconds`);
      if (timeSince.millis > 0)
        replyString.push(`${timeSince.millis} milliseconds`);

      msg.react("🪦");
      msg.reply(`Oop, You were ${replyString.join(", ")} late`);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { user } = interaction;

  if (interaction.commandName === "slinnvodascore") {
    
  }

  if (interaction.commandName === "bombstats") {
    const userBombMessages = await getBombMsgsFromDB(user.username);
    const is420Messages = userBombMessages.filter((msg) => msg.isFourTwenty);
    const accuracyFraction = `${is420Messages.length}/${userBombMessages.length}`;
    const accuracyPercent =
      (is420Messages.length / userBombMessages.length) * 100;

    if (interaction.options.getSubcommand() === "total") {
      console.log("total");
      interaction.reply(
        `You have sent ${userBombMessages.length} bomb messages`
      );
    }
    if (interaction.options.getSubcommand() === "accuracy") {
      console.log("accuracy");
      interaction.reply(
        `You have an accuracy of ${accuracyFraction} or ${accuracyPercent}%`
      );
    }
    if (interaction.options.getSubcommand() === "all") {
      console.log("all");
      interaction.reply(
        `You have sent ${userBombMessages.length} bomb messages, with an accuracy of ${accuracyPercent}%`
      );
    }
  }
});

client.login(botId);
