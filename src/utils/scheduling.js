const { CronJob } = require("cron");
const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { sample, max, pickBy } = require("lodash");
const { DateTime } = require("luxon");
const { getGuild, getGuildChannel } = require("./env");
const { handleCreateGuildEvent } = require("./events");
const {
  getUsersForGameNights,
  toggleUserInterestForGameNightTime,
  getUsersForGameNightTimes,
} = require("./firebase");
const { getCurrentWeek } = require("./time");

const ALL_MEME_CAPTIONS = [
  ["in response", "jin-gitaxias"],
  ["it's the weekend again?", "always has been"],
  ["call", "a judge"],
  ["get ready to call your local judge", "it's the weekend my dudes"],
  ["oh, you like playing edh?", "name every day of the weekend"],
  ["what are you waiting for?", "idk the weekend i guess", "me too kid"],
  ["friday", "saturday", "sunday"],
  ["quality time with friends", "game night on friday or saturday"],
  ["reblog if you want to", "go to waffle house or play magic"],
  ["play 25 games", "or win the game"],
  ["tfw", "weekday"],
  ["who wants to play some fuc", "some fucking magic the gather"],
  ["i am once again asking", "who wants to play commander"],
  ["our schedules", "the inexorable passage of time", "who wants to play edh"],
  ["hey does", "anyone want", "to play", "commander"],
  [
    "i make a meme",
    "people react to the meme",
    "we actually play magic",
    "we actually play magic",
  ],
  ["so elder", "such dragon", "very highlander", "pls react for schedule"],
  ["i spent a lot of money on cardboard", "i hope i get to play this weekend"],
  ["donate your free time", "to jin-gitaxias"],
  [
    "don't be like this asshole",
    "everyone hates him and he's a pariah to his people",
  ],
];

const MAX_BOXES = max(ALL_MEME_CAPTIONS.map((captions) => captions.length));

const weekdaysMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const getMemeCaptions = (meme) => {
  return sample(
    ALL_MEME_CAPTIONS.filter((captions) => captions.length === meme.box_count)
  );
};

const schedulerJobScheduler = (channelId, client) => {
  const now = DateTime.now();
  const today = now.weekday;

  const daysTillThursday = (weekdaysMap.thursday - today + 7) % 7;
  // const schedulerJobDate = now.plus({ days: daysTillThursday });
  const schedulerJobDate = now.plus({ seconds: 20 });

  const scheduler = new CronJob(new Date(schedulerJobDate), () =>
    schedulerJob(channelId, client)
  );

  console.log(
    `scheduler job scheduled for ${schedulerJobDate.toLocaleString(
      DateTime.DATETIME_FULL
    )}`
  );
  scheduler.start();

  const fridayJobDate = now.plus({ seconds: 40 });
  // const fridayJobDate = now.plus({ days: daysTillThursday + 1 });

  const eventCreator = new CronJob(new Date(fridayJobDate), () =>
    eventCreatorJob(channelId, client)
  );
  eventCreator.start();

  console.log(
    `event creator job scheduled for ${fridayJobDate.toLocaleString(
      DateTime.DATETIME_FULL
    )}`
  );
};

const schedulerJob = async (channelId, client) => {
  console.log("Running Scheduler Job");
  const days = await getUsersForGameNights(getCurrentWeek());
  const daysArray = Object.entries(days)
    .filter((v) => (v[1].users ? true : false))
    .map((day) => {
      if (!day[1] || !day[1].users) return;
      const interestedGamers = Object.entries(day[1].users).filter(
        (user) => user[1] === true
      ).length;

      return {
        id: day[0],
        day: day[1].day,
        users: day[1].users,
        interestedGamers: interestedGamers,
      };
    });

  //change me back
  const chosenDays = daysArray.filter((day) => day.interestedGamers >= 1);

  chosenDays.forEach(async (day) => {
    const userIdsArray = Object.keys(day.users);

    const usernames = userIdsArray.map((user) => `<@${user}>`);
    const usernamesString = usernames.join(",");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`6p#${day.id}`)
          .setLabel("6:00pm")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`7p#${day.id}`)
          .setLabel("7:00pm")
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`8p#${day.id}`)
          .setLabel("8:00pm")
          .setStyle(ButtonStyle.Primary)
      );

    const embed = new EmbedBuilder().addFields(
      BLANK_EMBED_FIELD,
      { name: `6:00pm`, value: "No gamers", inline: true },
      { name: `7:00pm`, value: "No gamers", inline: true },
      { name: `8:00pm`, value: "No gamers", inline: true }
    );

    const guild = await getGuild(client);
    const channel = await getGuildChannel(guild, channelId);
    channel.send({
      content: `${usernamesString} \n PICK A TIME FOR ${day.day.toUpperCase()} YOU FOOLS`,
      components: [row],
      embed: [embed],
    });
  });
};

const BLANK_EMBED_FIELD = { name: "\u200b", value: "\u200b" };
const getSchedulingEmbedFieldsByTime = (times) => {
  const timesArray = Object.entries(times);
  return timesArray.map(([time, users]) => ({
    name: `${time}`,
    value:
      Object.keys(pickBy(users || {}))
        .map((userId) => `<@${userId}>`)
        .join(", ") || "No gamers",
    inline: true,
  }));
};

const handleSchedulingTimeButtonInteraction = async (interaction) => {
  const week = getCurrentWeek();
  const button = interaction.message.components[0].components.filter(
    (button) => button.data.custom_id === interaction.customId
  )[0];

  const [chosenTime, dayId] = button.data.custom_id.split("#");

  const time = chosenTime[0] + ":00pm";

  await toggleUserInterestForGameNightTime(
    week,
    dayId,
    time,
    interaction.user.id
  );

  const usersForTimes = await getUsersForGameNightTimes(week, dayId);
  const fields = getSchedulingEmbedFieldsByTime(usersForTimes);
  const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(
    BLANK_EMBED_FIELD,
    ...fields
  );

  interaction.message.edit({ embeds: [embed] });
  interaction.deferUpdate();
};

const eventCreatorJob = async (channelId, client) => {
  const currentWeek = getCurrentWeek();
  const days = await getUsersForGameNights(currentWeek);

  const guild = await getGuild(client);
  const channel = await getGuildChannel(guild, channelId);

  Object.entries(days).forEach((day) => {
    if (!day) return;
    const [dayId, dayObj] = day;
    if (!dayObj.times) return;
    const times = Object.entries(dayObj.times);
    times.forEach(async (timeObj) => {
      const [time, users] = timeObj;
      //change me when push to prod
      if (Object.entries(users).length >= 1) {
        const now = DateTime.now();

        const weekdayNum = weekdaysMap[dayObj.day];
        const daysTillWeekday = (weekdayNum - now.weekday + 7) % 7;

        const timeMap = { "6:00pm": 18, "7:00pm": 19, "8:00pm": 20 };
        const startTime = timeMap[time];

        const startDateTimeDays = now.plus({ days: daysTillWeekday });

        const startDateTimeTime = startDateTimeDays.set({
          hour: startTime,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        await handleCreateGuildEvent({
          guild: guild,
          name: `${dayObj.day.toUpperCase()} Night Magic`,
          scheduledStartTime: startDateTimeTime,
          description: "LET'S GET READY TO RUMBLEEE",
        });
        channel.send(
          `I have created an event for ${dayObj.day.toUpperCase()} at ${time}. \n We would be honored, if you would join us.`
        );
      }
    });
  });
};

module.exports = {
  getMemeCaptions,
  MAX_BOXES,
  schedulerJob,
  handleSchedulingTimeButtonInteraction,
  schedulerJobScheduler,
};
