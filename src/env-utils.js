const isProductionServer = (guildId) => guildId === process.env.SERVER_ID;

module.exports = isProductionServer;
