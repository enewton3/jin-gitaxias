require("dotenv").config();

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField } = require("discord.js");
const { sendData } = require("./firebase-utils");

const intents = new IntentsBitField();

intents.add(
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.MessageContent
  // IntentsBitField.Flags.GuildMembers
);

const emotes = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

const trackedEmotes = [
  ":bomb:",
  ":bombisland: ",
  ":massbomb: ",
  ":calibomb: ",
  ":connectibomb: ",
  ":kentuckybombedchicken: ",
  ":nanbomb: ",
  ":nebomba: ",
  ":texbomb: ",
  ":thebombapple:",
];

const client = new Client({ intents: intents });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  console.log("emotes: ", emotes(msg.content));

  if (msg.content.includes("ping")) {
    msg.reply("pong");
  }

  if (msg.content.includes("bomb")) {
    const dataToSend = {
      timestamp: msg.createdTimestamp,
      author: msg.author.username,
      content: msg.content,
    };

    sendData(dataToSend, msg.author.username);

    msg.reply("nice");
  }
});

client.login(botId);
