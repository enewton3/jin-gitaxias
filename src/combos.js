const { size } = require("lodash");
const { DateTime } = require("luxon");

const { numbersTM } = require("./messages");
const { bombTimezones, bombEmojiIdMap } = require("./utils/emotes");
const { getComboFromDB } = require("./utils/firebase");
const { matchesBombHour } = require("./utils/time");

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

module.exports = { handleComboJob };
