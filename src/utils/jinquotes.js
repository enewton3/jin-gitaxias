//prettier-ignore
const jinquotes = [
  {
    cardName: "Atmosphere Surgeon",
    quote:"It is Jin-Gitaxias's deepest exasperation that any part of his domain still requires maintenance.",
    attribution: "",
  },
  {
    cardName: "Blue Sun's Twilight",
    quote:"Where once there was ignorance, Jin-Gitaxias brought knoweldge, and an age of progress dawned.",
    attribution: "— Monument inscription",
  },
  {
    cardName: "Breeding Pool",
    quote: "Where Jin-Gitaxias's ingenuity meets Vorinclex's inhumanity.",
    attribution: "",
  },
  {
    cardName: "Consecrated Sphinx",
    quote: "Blessed by the hands of Jin-Gitaxias.",
    attribution: "",
  },
  {
    cardName: "Culling Dais",
    quote: "Forswear the flesh and you will truly see",
    attribution: "— Jin-Gitaxias, Core Augur",
  },
  {
    cardName: "Distant Memories",
    quote: "The fleeting shadows of his primitive self have all but vanished.",
    attribution: "— Jin-Gitaxias, Core Augur",
  },
  {
    cardName: "Explosive Entry",
    quote: "Kaito and Tamiyo charged headlong into Jin-Gitaxias's secret lab, unaware that the praetor was eagerly awaiting their arrival.",
    attribution: "",
  },
  {
    cardName: "Inexorable Tide",
    quote:"See how gratefully this world accepts our blessings.",
    attribution: "— Jin-Gitaxias, Core Augur",
  },
  {
    cardName: "Jin-Gitaxias, Core Augur",
    quote: "It is not a goal, but a process—the process of creating the perfect Phyrexia.",
    attribution: "",
  },
  {
    cardName: "Malicious Malfunction",
    quote: "'That? A minor test, nothing more. Incompleat flesh is weak.'",
    attribution: "— Jin-Gitaxias",
  },
  {
    cardName: "Planar Incision",
    quote: "Jin-Gitaxias had long coveted the secrets of planeswalking. Spirits that could pass between worlds made for perfect test subjects.",
    attribution: "",
  },
  {
    cardName: "Praetor's Grasp ",
    quote: "Wake up, new Phyrexian Planeswalker! You will not be the last.",
    attribution: "— Jin-Gitaxias",
  },
  {
    cardName: "Psychic Miasma",
    quote:  "'A mind may be steeled against madness, but all battlements fall in time.'",
    attribution: "— Jin-Gitaxias, Core Augur",
  },
  {
    cardName: "Synthetic Destiny",
    quote: "To Jin-Gitaxias, perfection is not a goal, but a process.",
    attribution: "",
  },
  {
    cardName: "Tamiyo's Safekeeping",
    quote: "To keep the Reality Chip out of Jin-Gitaxias's hands, the Wanderer entrusted it to Tamiyo.",
    attribution: "",
  },
  {
    cardName: "The Surgical Bay",
    quote: "In Jin-Gitaxias's domain, strange and terrible experiments iterate toward perfection, unbound by ethics.",
    attribution: "",
  },
  {
    cardName: "Xenograft",
    quote: "I despise Vorinclex and his slobberings about evolution. Only I know true progress.",
    attribution: "— Jin-Gitaxias, Core Augur",
  },
];

const randomJinQuote = () => {
  return jinquotes[Math.floor(Math.random() * jinquotes.length)];
};

const jinActivities = [
  ["LISTENING", "TO MIRRAN SECRETS"],
  ["STREAMING", "FROM THE QUICKSILVER SEA"],
  ["PLAYING", " BOTH SIDES OF THE CONFLICT"],
  ["WATCHING", "FROM THE SHADOWS"],
];

const randomActivity = () => {
  return jinActivities[Math.floor(Math.random() * jinActivities.length)];
};

const handleActivityChange = (client) => {
  const activity = randomActivity();
  client.user.setActivity({ name: activity[1], type: activity[0] });
};

module.exports = {
  randomJinQuote,
  randomActivity,
  handleActivityChange,
};
