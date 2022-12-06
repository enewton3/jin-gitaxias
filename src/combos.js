const { size } = require("lodash");
const { DateTime } = require("luxon");
const { bombTimezones, bombEmojiIdMap } = require("./emotes-utils");
const { getComboFromDB } = require("./firebase-utils");
const { numbersTM } = require("./messages");
const { matchesBombHour } = require("./time-utils");

const handleComboJob = async (channel) => {
  const nowDate = DateTime.now();

  let dateInFourTwentyTimezone = null;

  for (const timezone of bombTimezones) {
    const dateInTimezone = nowDate.setZone(timezone);

    if (matchesBombHour(dateInTimezone.hour)) {
      dateInFourTwentyTimezone = dateInTimezone;
    }
  }

  if (!dateInFourTwentyTimezone) return;

  const todaysCombo = await getComboFromDB(dateInFourTwentyTimezone);

  if (!todaysCombo) return;

  if (size(todaysCombo) >= 2) {
    const todaysComboEmojis = Object.values(todaysCombo).map(
      (emoji) => `<${emoji}${bombEmojiIdMap[emoji]}>`
    );

    channel.send(
      `${
        numbersTM[size(todaysCombo)]
      } :negative_squared_cross_mark:   :b::o2::m::b::o2::grey_exclamation::grey_exclamation: 
    `
    );
    channel.send(`${todaysComboEmojis.join(" ")}`);
  }
};

const streakCounter = () => {
  
}


module.exports = { handleComboJob };
