require("dotenv").config();
console.log(process.env);
const cron = require("cron");

const botId = process.env.BOT_TOKEN;

const { Client, IntentsBitField, Partials } = require("discord.js");
const {
  handleBombStatsInteraction,
  handleSlinnVodaScoreInteraction,
  handleBombMessageScrapeInteraction,
  handleSchedulingInteraction,
  handleSlinnVodaScoreScrapeInteraction,
} = require("./interactions");
const { includesBomb, isSlinnVoda } = require("./emotes-utils");
const { addToSlinnVodaScore } = require("./firebase-utils");
const { handleBombMessage } = require("./messages");
const { handleComboJob } = require("./combos");

const intents = new IntentsBitField();

intents.add(
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.GuildMessageReactions
);

const client = new Client({
  intents: intents,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`);
  const channel = await guild.channels.fetch(`${process.env.CHANNEL_ID}`);

  const comboJob = new cron.CronJob(
    "22 16 * * *",
    () => handleComboJob(channel),
    () => console.log("Combo job ran at 16:22"),
    true,
    "UTC-5",
    false,
    true
  );

  comboJob.start();
});

client.on("messageCreate", (msg) => {
  console.log(JSON.stringify(msg, null, 4));
  if (includesBomb(msg.content) && msg.channelId === process.env.CHANNEL_ID) {
    handleBombMessage(msg);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  }

  if (isSlinnVoda(reaction.emoji.name)) {
    addToSlinnVodaScore(reaction.message.author.id);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "slinnvodascore") {
    await handleSlinnVodaScoreInteraction(interaction);
  }

  if (interaction.commandName === "bombstats") {
    await handleBombStatsInteraction(interaction);
  }

  if (interaction.commandName === "itstimetoduel") {
    await handleSchedulingInteraction(interaction);
  }

  if (interaction.commandName === "bombmessagesscrape") {
    await handleBombMessageScrapeInteraction(interaction);
  }

  if (interaction.commandName === "slinnvodascrape") {
    await handleSlinnVodaScoreScrapeInteraction(interaction);
  }
});

client.login(botId);
