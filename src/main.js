require("dotenv").config();

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField } = require("discord.js");
const { emotes, includesBomb } = require("./emotes-utils");
const { sendData } = require("./firebase-utils");
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

  // if (msg.content.includes("ping")) {
  //   msg.reply("pong");
  // }
  if (msg.author === "Jin-Gitaxias") {
    console.log("it me");
    return;
  }
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
    sendData(dataToSend, msg.author.username);

    msg.reply("nice");
  }
});

client.login(botId);
