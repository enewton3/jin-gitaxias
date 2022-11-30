require("dotenv").config();
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
const { getBombMatches, isSlinnVoda } = require("./emotes-utils");
const { addToSlinnVodaScore } = require("./firebase-utils");
const { handleBombMessage } = require("./messages");
const { handleComboJob } = require("./combos");
const isProductionServer = require("./env-utils");
const isActiveServer = require("./env-utils");

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
  console.log(`RUNNING IN ${process.env.NODE_ENV}`);

  const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`);
  const channel = await guild.channels.fetch(`${process.env.CHANNEL_ID}`);
  const comboJob = new cron.CronJob(
    "22 * * * *",
    () => handleComboJob(channel),
    () => console.log("Combo job ran"),
    true
  );

  comboJob.start();
});

client.on("messageCreate", (msg) => {
  if (msg.channelId !== process.env.CHANNEL_ID) return;

  const matches = getBombMatches(msg.content);

  const timezones = new Set(matches.map(([, timezone]) => timezone));

  // Remove regular bomb from matches if there are more specific bombs
  if (timezones.size > 1 && timezones.has(null)) {
    timezones.delete(null);
  }

  if (timezones.size > 1) {
    console.log("TOO MANY TUNAS");
  } else if (timezones.size === 1) {
    handleBombMessage(msg, matches[0][1]);
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

  if (
    isSlinnVoda(reaction.emoji.name) &&
    user.id !== reaction.message.author.id
  ) {
    addToSlinnVodaScore(reaction.message.author.id);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!isActiveServer(interaction.guild.id)) return;

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
