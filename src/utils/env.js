const isActiveServer = (guildId) => guildId === process.env.SERVER_ID;

const isTESTChannel = (channelId) => channelId === process.env.CHANNEL_ID;

const isProduction = () => process.env.NODE_ENV === "production";

module.exports = { isActiveServer, isTESTChannel, isProduction };
