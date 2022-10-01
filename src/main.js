require("dotenv").config();

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField } = require("discord.js");
const { emotes, includesBomb } = require("./emotes-utils");
const { sendData, sendBombMsgToDB } = require("./firebase-utils");
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
  // console.log("emotes: ", emotes(msg.content));

  if (includesBomb(msg.content)) {
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

    msg.reply("nice");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { user } = interaction;

  console.log(interaction);

  if (interaction.commandName === "user") {
    interaction.reply(
      `Your user name is ${user.username}, and your ID is ${user.id}`
    );
  }

  if ((interaction.commandName = "mybombstats")) {
    interaction.reply("NAILED IT");
  }
});

client.login(botId);
