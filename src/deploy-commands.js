require("dotenv").config();

const { REST, SlashCommandBuilder, Routes } = require("discord.js");
const clientId = process.env.CLIENT_ID;
const guildId = process.env.SERVER_TOKEN;
const botId = process.env.BOT_TOKEN;

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
].map((command) => command.toJSON());

// const emptyCommands = [];

const rest = new REST({ version: "10" }).setToken(botId);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: emptyCommands,
  })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
