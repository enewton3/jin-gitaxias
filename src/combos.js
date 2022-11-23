const { getComboNumberFromDB } = require("./firebase-utils");

const handleComboJob = async (channel) => {
  console.log(channel);
  const todaysCombo = await getComboNumberFromDB();
  if (todaysCombo < 2) return;

  channel.send(`${todaysCombo}X COMBO!!!`);
};

module.exports = { handleComboJob };
