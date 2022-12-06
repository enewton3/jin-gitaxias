const { sample, max } = require("lodash");

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

const getMemeCaptions = (meme) => {
  return sample(
    ALL_MEME_CAPTIONS.filter((captions) => captions.length === meme.box_count)
  );
};

module.exports = { getMemeCaptions, MAX_BOXES };
