const isActiveServer = (guildId) => guildId === process.env.SERVER_ID;

const isTESTChannel = (channelId) => channelId === process.env.CHANNEL_ID;

const isProduction = () => process.env.NODE_ENV === "production";

const getGuild = async (client) =>
  await client.guilds.fetch(`${process.env.SERVER_ID}`);

const getGuildChannel = async (guild, channelId) =>
  await guild.channels.fetch(`${channelId}`);

module.exports = {
  isActiveServer,
  isTESTChannel,
  isProduction,
  getGuild,
  getGuildChannel,
};
