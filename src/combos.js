const { DateTime } = require("luxon");
const { bombTimezones } = require("./emotes-utils");
const { getComboNumberFromDB } = require("./firebase-utils");

const handleComboJob = async (channel) => {
  const nowDate = DateTime.now();

  let dateInFourTwentyTimezone = null;

  for (const timezone of bombTimezones) {
    const dateInTimezone = nowDate.setZone(timezone);

    if (dateInTimezone.hour === 4 || dateInTimezone.hour === 16) {
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
