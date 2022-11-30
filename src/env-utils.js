const isActiveServer = (guildId) => guildId === process.env.SERVER_ID;

module.exports = isActiveServer;
