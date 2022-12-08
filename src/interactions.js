const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { sampleSize, sortBy, capitalize, pickBy } = require("lodash");
const { DateTime } = require("luxon");
const { v4 } = require("uuid");

const Imgflip = require("./imgflip").default;
const {
  getBombMsgsFromDB,
  getSlinnVodaScore,
  toggleUserInterestForGameNight,
  storeSchedulingMemeRecord,
  getUsersForGameNights,
} = require("./utils/firebase");
const { getBombMatches, getTimezoneForEmoji } = require("./utils/emotes");
const { getMemeCaptions, MAX_BOXES } = require("./utils/scheduling");
const { isFourTwenty, getCurrentWeek } = require("./utils/time");

const imgflip = new Imgflip({
  username: process.env.IMGFLIP_USERNAME,
  password: process.env.IMGFLIP_PASSWORD,
});

const handleBombStatsInteraction = async (interaction) => {
  const userBombMessages = await getBombMsgsFromDB(interaction.user.id);
  const is420Messages = userBombMessages.filter((msg) => {
    const msgTimezone = getTimezoneForEmoji(getBombMatches(msg.content)[0]);
    return isFourTwenty(msg.discordTimestamp, msgTimezone);
  });

  const accuracyFraction = is420Messages.length / userBombMessages.length;
  const accuracyPercent = parseFloat(accuracyFraction.toFixed(5)) * 100;

  if (interaction.options.getSubcommand() === "total") {
    interaction.reply(`You have sent ${userBombMessages.length} bomb messages`);
  }
  if (interaction.options.getSubcommand() === "accuracy") {
    interaction.reply(
      `You have an accuracy of ${accuracyFraction} or ${accuracyPercent}%`
    );
  }
  if (interaction.options.getSubcommand() === "all") {
    interaction.reply(
      `You have sent ${userBombMessages.length} bomb messages, with an accuracy of ${accuracyPercent}%`
    );
  }
};

const handleSlinnVodaScoreInteraction = async (interaction) => {
  const userSlinnVodaScore = await getSlinnVodaScore(interaction.user.id);
  interaction.reply(`Your Slinn Voda Score is ${userSlinnVodaScore}`);
};

const BLANK_EMBED_FIELD = { name: "\u200b", value: "\u200b" };

const getSchedulingEmbedFields = (allDays) => {
  const sortedDays = sortBy(Object.values(allDays), ["day"]);
  return sortedDays.map(({ day, emoji, users }) => ({
    name: `${emoji} ${capitalize(day)}`,
    value:
      Object.keys(pickBy(users || {}))
        .map((userId) => `<@${userId}>`)
        .join(", ") || "No gamers",
    inline: true,
  }));
};

const handleSchedulingInteraction = async (interaction, client) => {
  const inResponseGuild = await client.guilds.fetch(
    process.env.IN_RESPONSE_GUILD_ID
  );
  const inResponseEmojis = inResponseGuild.emojis.cache
    .map((emoji) => emoji.toString())
    .filter((emoji) => !emoji.includes("bomb"));
  const [fridayEmoji, saturdayEmoji, sundayEmoji] = sampleSize(
    inResponseEmojis,
    3
  );
  const meme = await imgflip.randomMeme(MAX_BOXES);
  const url = await imgflip.createMeme(meme.id, {
    captions: getMemeCaptions(meme),
  });
  const weekendDayIds = {
    friday: v4(),
    saturday: v4(),
    sunday: v4(),
  };

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(weekendDayIds.friday)
        .setLabel("Friday")
        .setStyle(ButtonStyle.Primary)
        .setEmoji(fridayEmoji)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId(weekendDayIds.saturday)
        .setLabel("Saturday")
        .setStyle(ButtonStyle.Success)
        .setEmoji(saturdayEmoji)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId(weekendDayIds.sunday)
        .setLabel("Sunday")
        .setStyle(ButtonStyle.Danger)
        .setEmoji(sundayEmoji)
    );

  const embed = new EmbedBuilder()
    .setTitle("It's time to d-d-d-d-d-duel")
    .setDescription(
      "React for commander this weekend <:powerfulmagic:941788306876805180>"
    )
    .setImage(url)
    .addFields(
      BLANK_EMBED_FIELD,
      { name: `${fridayEmoji} Friday`, value: "No gamers", inline: true },
      { name: `${saturdayEmoji} Saturday`, value: "No gamers", inline: true },
      { name: `${sundayEmoji} Sunday`, value: "No gamers", inline: true }
    );

  const message = await interaction.reply({
    embeds: [embed],
    components: [row],
  });

  await storeSchedulingMemeRecord(
    getCurrentWeek(),
    message.id,
    url,
    weekendDayIds,
    {
      friday: fridayEmoji,
      saturday: saturdayEmoji,
      sunday: sundayEmoji,
    }
  );
};

const handleSchedulingButtonInteraction = async (interaction) => {
  const week = getCurrentWeek();

  await toggleUserInterestForGameNight(
    interaction.user.id,
    week,
    interaction.customId
  );

  const usersForDays = await getUsersForGameNights(week);
  const fields = getSchedulingEmbedFields(usersForDays);
  const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(
    BLANK_EMBED_FIELD,
    ...fields
  );

  interaction.message.edit({ embeds: [embed] });
  interaction.deferUpdate();
};

const handleJinVodaScore = async (interaction) => {
  const botScore = await getSlinnVodaScore(process.env.BOT_CLIENT_ID);
  interaction.reply(`So you do care! Jin Voda Score is ${botScore}`);
};

const handleBombMessageScrapeInteraction = (interaction) => {
  interaction.reply("Will be supported eventually");
};

const handleSlinnVodaScoreScrapeInteraction = (interaction) => {
  interaction.reply("This will be supported soon");
};

module.exports = {
  handleBombStatsInteraction,
  handleSchedulingInteraction,
  handleSlinnVodaScoreInteraction,
  handleBombMessageScrapeInteraction,
  handleSlinnVodaScoreScrapeInteraction,
  handleSchedulingButtonInteraction,
  handleJinVodaScore,
};
