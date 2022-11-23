const { getBombMsgsFromDB, getSlinnVodaScore } = require("./firebase-utils");

const handleBombStatsInteraction = async (interaction, user) => {
  const userBombMessages = await getBombMsgsFromDB(user.username);
  const is420Messages = userBombMessages.filter((msg) => msg.isFourTwenty);
  const accuracyFraction = `${is420Messages.length}/${userBombMessages.length}`;
  const accuracyPercent =
    (is420Messages.length / userBombMessages.length) * 100;

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

const handleSlinnVodaScoreInteraction = async (interaction, user) => {
  const userSlinnVodaScore = await getSlinnVodaScore(user.username);
  interaction.reply(`Your Slinn Voda Score is ${userSlinnVodaScore}`);
};

const handleSchedulingInteraction = (interaction, user) => {
  interaction.reply("Scheduling will happen here eventually");
};

const handleBombMessageScrapeInteraction = (interaction, user) => {
  interaction.reply("Will be supported eventually");
};

const handleSlinnVodaScoreScrapeInteraction = (interaction, user) => {
  interaction.reply("This will be supported soon");
};

module.exports = {
  handleBombStatsInteraction,
  handleSchedulingInteraction,
  handleSlinnVodaScoreInteraction,
  handleBombMessageScrapeInteraction,
  handleSlinnVodaScoreScrapeInteraction,
};