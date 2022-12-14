require("dotenv").config();

const {
  REST,
  SlashCommandBuilder,
  Routes,
  SlashCommandSubcommandBuilder,
} = require("discord.js");
const clientId = process.env.BOT_CLIENT_ID;
const guildId = process.env.SERVER_ID;
const botToken = process.env.BOT_TOKEN;

const commands = [
  new SlashCommandBuilder()
    .setName("bombstats")
    .setDescription("Get bomb stats!")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("total")
        .setDescription("Your total bomb messages")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("accuracy")
        .setDescription("Your 4:20 accuracy")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("all")
        .setDescription("All of your stats collated nicely for you")
    ),
  new SlashCommandBuilder()
    .setName("slinnvodascore")
    .setDescription("Get your Slinn Voda Score!"),
  new SlashCommandBuilder()
    .setName("itstimetoduel")
    .setDescription("Start a poll GIF to schedule a game night!"),
].map((command) => command.toJSON());

const emptyCommands = [];

const rest = new REST({ version: "10" }).setToken(botToken);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
