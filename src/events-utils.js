const { GuildScheduledEventManager } = require("discord.js");

const handleCreateGuildEvent = async ({
  guild,
  name,
  scheduledStartTime,
  description,
}) => {
  const guildEventManager = new GuildScheduledEventManager(guild);
  const voiceChannel = await guild.channels.fetch(process.env.VOICE_CHANNEL_ID);

  const privacyLevel = 2;
  const entityType = 2;
  const eventOptions = {
    name,
    scheduledStartTime,
    description,
    privacyLevel,
    entityType,
    channel: voiceChannel,
  };

  guildEventManager.create(eventOptions);
};

module.exports = { handleCreateGuildEvent };
