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
const {
  getBombMatches,
  isSlinnVoda,
  getTimezoneForEmoji,
} = require("./emotes-utils");
const { addToSlinnVodaScore } = require("./firebase-utils");
const { handleBombMessage } = require("./messages");
const { handleComboJob } = require("./combos");
const { isActiveServer, isProduction, isTESTChannel } = require("./env-utils");
const { BOMB_TIME_MINUTE } = require("./time-utils");

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

const COMBO_JOB_WAIT_TIME_MINUTES = 2;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`RUNNING IN ${process.env.NODE_ENV}`);

  const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`);
  const channel = await guild.channels.fetch(`${process.env.CHANNEL_ID}`);
  const comboJob = new cron.CronJob(
    `${(BOMB_TIME_MINUTE + COMBO_JOB_WAIT_TIME_MINUTES) % 60} * * * *`,
    () => handleComboJob(channel),
    () => console.log("Combo job ran"),
    true
  );

  comboJob.start();
});

client.on("messageCreate", (msg) => {
  if (msg.channelId !== process.env.CHANNEL_ID) return;
  if (msg.author.id === process.env.BOT_CLIENT_ID) return;

  let matchingEmojis = getBombMatches(msg.content);

  if (matchingEmojis.length > 1) {
    matchingEmojis = matchingEmojis.filter((emoji) => emoji !== ":bomb:");
  }

  const timezones = matchingEmojis.map((emoji) => getTimezoneForEmoji(emoji));
  const timezonesSet = new Set(timezones);

  if (timezonesSet.size > 1) {
    msg.reply("TOO MANY TUNAS");
  } else if (timezonesSet.size === 1) {
    handleBombMessage(msg, timezones[0], matchingEmojis[0]);
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
  if (!isActiveServer(interaction.guildId)) return;
  if (!isProduction() && !isTESTChannel(interaction.channelId)) {
    interaction.reply("Please try again in your own testing channel <3");
    return;
  }

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
