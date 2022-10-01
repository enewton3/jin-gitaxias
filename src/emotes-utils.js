const trackedEmotes = [
  ":bomb:",
  ":bombisland:",
  ":massbomb:",
  ":calibomb:",
  ":connectibomb:",
  ":kentuckybombedchicken:",
  ":nanbomb:",
  ":nebomba:",
  ":texbomb:",
  ":thebombapple:",
];

const emotes = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);

const includesBomb = (msg) => {
  const included = trackedEmotes.filter((emote) =>
    msg.includes(emote) ? emote : null
  );
  if (included.length > 0) {
    return true;
  }
  return false;
};

module.exports = {
  emotes,
  includesBomb,
};
