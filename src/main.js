require("dotenv").config();

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField } = require("discord.js");
const { emotes, includesBomb } = require("./emotes-utils");
const {
  sendData,
  sendBombMsgToDB,
  getBombMsgsFromDB,
} = require("./firebase-utils");
const { isFourTwenty, getNiceTime, getNiceDate } = require("./time-utils");

const intents = new IntentsBitField();

intents.add(
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.MessageContent
  // IntentsBitField.Flags.GuildMembers
);

const client = new Client({ intents: intents });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  // const differentDay = new Date("30 September 2022 07:35");
  if (includesBomb(msg.content)) {
    const dataToSend = {
      discordTimestamp: msg.createdTimestamp,
      author: msg.author.username,
      content: msg.content,
      niceDate: getNiceDate(msg.createdTimestamp),
      // niceDate: getNiceDate(differentDay),
      // niceTime: getNiceTime(differentDay),
      niceTime: getNiceTime(msg.createdTimestamp),
      isFourTwenty: isFourTwenty(msg.createdTimestamp),
      // isFourTwenty: true,
    };
    console.log(dataToSend);
    sendBombMsgToDB(dataToSend, msg.author.username);

    msg.reply("nice");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { user } = interaction;

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
