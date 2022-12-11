require("dotenv").config();

const cron = require("cron");
const { Client, IntentsBitField, Partials } = require("discord.js");

const { handleComboJob } = require("./combos");
const {
  handleBombStatsInteraction,
  handleSlinnVodaScoreInteraction,
  handleBombMessageScrapeInteraction,
  handleSchedulingInteraction,
  handleSlinnVodaScoreScrapeInteraction,
  handleSchedulingButtonInteraction,
} = require("./interactions");
const {
  maybeHandleBombMessage,
  maybeHandleCommanderDamageMessage,
  maybeHandleForgetfulMessage,
  maybeHandleGoodBot,
  maybeHandleJinMention,
} = require("./messages");
const { maybeHandleSlinnVodaScore } = require("./reactions");
const { isActiveServer, isProduction, isTESTChannel } = require("./utils/env");
const { BOMB_TIME_MINUTE } = require("./utils/time");

const botId = process.env.BOT_TOKEN;
const COMBO_JOB_WAIT_TIME_MINUTES = 2;

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
    `${(BOMB_TIME_MINUTE + COMBO_JOB_WAIT_TIME_MINUTES) % 60} * * * *`,
    () => handleComboJob(channel),
    () => console.log("Combo job ran"),
    true
  );

  comboJob.start();
});

client.on("messageCreate", (msg) => {
  if (msg.author.id === process.env.BOT_CLIENT_ID) return;
  if (msg.guildId !== process.env.SERVER_ID) return;

  maybeHandleCommanderDamageMessage(msg);
  maybeHandleForgetfulMessage(msg);
  maybeHandleGoodBot(msg);
  maybeHandleJinMention(msg);

  if (msg.channelId !== process.env.CHANNEL_ID) return;

  maybeHandleBombMessage(msg);
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

  maybeHandleSlinnVodaScore(reaction, user);
});

client.on("interactionCreate", async (interaction) => {
  if (!isActiveServer(interaction.guildId)) return;
  if (!isProduction() && !isTESTChannel(interaction.channelId)) return;

  if (interaction.isButton()) {
    if (interaction.message.interaction.commandName === "itstimetoduel") {
      await handleSchedulingButtonInteraction(interaction);
    }
  } else if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "slinnvodascore") {
      await handleSlinnVodaScoreInteraction(interaction);
    }

    if (interaction.commandName === "bombstats") {
      await handleBombStatsInteraction(interaction);
    }

    if (interaction.commandName === "itstimetoduel") {
      await handleSchedulingInteraction(interaction, client);
      interaction.channel.createMessageComponentCollector;
    }

    if (interaction.commandName === "bombmessagesscrape") {
      await handleBombMessageScrapeInteraction(interaction);
    }

    if (interaction.commandName === "slinnvodascrape") {
      await handleSlinnVodaScoreScrapeInteraction(interaction);
    }
  }
});

client.login(botId);
