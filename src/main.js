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

let primaryChannel;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const testingGuild = await client.guilds.fetch("1022967209154330735");
  primaryChannel = await testingGuild.channels.fetch("1022967209154330738");
  console.log(primaryChannel);

  const comboJob = new cron.CronJob(
    "22 16 * * *",
    () => handleComboJob(primaryChannel),
    () => console.log("Combo job ran at 16:22"),
    true,
    "UTC-5",
    false,
    true
  );

  comboJob.start();
});

client.on("messageCreate", (msg) => {
  if (includesBomb(msg.content)) {
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
    addToSlinnVodaScore(user.username);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { user } = interaction;

  if (interaction.commandName === "slinnvodascore") {
    await handleSlinnVodaScoreInteraction(interaction, user);
  }

  if (interaction.commandName === "bombstats") {
    await handleBombStatsInteraction(interaction, user);
  }

  if (interaction.commandName === "itstimetoduel") {
    await handleSchedulingInteraction(interaction, user);
  }

  if (interaction.commandName === "bombmessagesscrape") {
    await handleBombMessageScrapeInteraction(interaction, user);
  }

  if (interaction.commandName === "slinnvodascrape") {
    await handleSlinnVodaScoreScrapeInteraction(interaction, user);
  }
});

client.login(botId);
