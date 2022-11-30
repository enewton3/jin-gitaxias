const { getBombMsgsFromDB, getSlinnVodaScore } = require("./firebase-utils");
const Imgflip = require("./imgflip").default;
const { isFourTwenty } = require("./time-utils");

const handleBombStatsInteraction = async (interaction) => {
  const userBombMessages = await getBombMsgsFromDB(interaction.user.id);
  const is420Messages = userBombMessages.filter((msg) =>
    isFourTwenty(msg.discordTimestamp)
  );
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

const handleSlinnVodaScoreInteraction = async (interaction) => {
  const userSlinnVodaScore = await getSlinnVodaScore(interaction.user.id);
  interaction.reply(`Your Slinn Voda Score is ${userSlinnVodaScore}`);
};

const handleSchedulingInteraction = async (interaction) => {
  interaction.reply("Scheduling will happen here eventually");
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
};
