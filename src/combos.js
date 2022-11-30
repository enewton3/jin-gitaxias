const { DateTime } = require("luxon");
const { bombTimezones } = require("./emotes-utils");
const { getComboNumberFromDB } = require("./firebase-utils");
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

  const todaysCombo = await getComboNumberFromDB(dateInFourTwentyTimezone);

  if (todaysCombo >= 2) {
    channel.send(`${todaysCombo}X COMBO!!!`);
  }
};

module.exports = { handleComboJob };
