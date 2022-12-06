const { isSlinnVoda } = require("./utils/emotes");
const { addToSlinnVodaScore } = require("./utils/firebase");

const maybeHandleSlinnVodaScore = (reaction, user) => {
  if (
    isSlinnVoda(reaction.emoji.name) &&
    user.id !== reaction.message.author.id
  ) {
    console.log(
      `Handling add to slinnvoda score for ${reaction.message.author.id}`
    );
    addToSlinnVodaScore(reaction.message.author.id);
  }
};

module.exports = {
  maybeHandleSlinnVodaScore,
};
