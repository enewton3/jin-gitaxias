const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  get,
  child,
  increment,
  runTransaction,
} = require("firebase/database");
const { has, invert, mapValues } = require("lodash");
const { DateTime } = require("luxon");

require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const makePathMaker = (sliceName) => (subPath) =>
  `/${process.env.SERVER_ID}/${sliceName}/${subPath}`;

const makeMessagesPath = makePathMaker("bombMessages");
const makeSlinnVodaPath = makePathMaker("slinnVodaScores");
const makeComboPath = makePathMaker("comboCounts");
const makeGameNightPath = makePathMaker("gameNights");

const makeSanitizedComboPath = (dateTime) => {
  const sanitizedTimezone = dateTime.zoneName.replace("/", "-");
  const sanitizedDate = dateTime
    .toLocaleString(DateTime.DATE_SHORT)
    .replaceAll("/", "-");
  return makeComboPath(
    `${sanitizedTimezone}/${sanitizedDate}/${dateTime.toFormat("a")}`
  );
};

const sendBombMsgToDB = async (payload) => {
  try {
    await set(
      ref(db, makeMessagesPath(`${payload.authorId}/${payload.messageId}`)),
      payload
    );
  } catch (e) {
    console.log(e);
  }
};

const getBombMsgsFromDB = async (userId) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, makeMessagesPath(userId)));
    if (!resp.val()) return;
    return Object.values(resp.val());
  } catch (e) {
    console.log(e);
  }
};

const addToSlinnVodaScore = async (userId) => {
  try {
    await set(ref(db, makeSlinnVodaPath(userId)), increment(1));
  } catch (e) {
    console.log(e);
  }
};

const getSlinnVodaScore = async (userId) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, makeSlinnVodaPath(userId)));
    if (!resp.val()) return 0;
    return resp.val();
  } catch (e) {
    console.log(e);
  }
};

const bombComboToDB = async (userId, msgDateTime, emoji) => {
  try {
    await set(
      ref(db, `${makeSanitizedComboPath(msgDateTime)}/${userId}`),
      emoji
    );
  } catch (e) {
    console.log(e);
  }
};

const isUserInCombo = async (userId, dateInTimezone) => {
  const dbRef = ref(db);
  try {
    const resp = await get(
      child(dbRef, makeSanitizedComboPath(dateInTimezone))
    );
    const comboUsers = resp.val();
    return has(comboUsers, userId);
  } catch (e) {
    console.log(e);
  }
};

const getComboFromDB = async (dateInTimezone) => {
  const dbRef = ref(db);

  try {
    const resp = await get(
      child(dbRef, makeSanitizedComboPath(dateInTimezone))
    );
    return resp.val();
  } catch (e) {
    console.log(e);
  }
};

const storeSchedulingMemeRecord = async (
  week,
  messageId,
  memeUrl,
  weekendDayIds,
  weekendEmojis
) => {
  try {
    await set(ref(db, makeGameNightPath(week)), {
      messageId,
      memeUrl,
      days: mapValues(invert(weekendDayIds), (day) => ({
        day,
        emoji: weekendEmojis[day],
      })),
    });
  } catch (e) {
    console.log(e);
  }
};

const toggleUserInterestForGameNight = async (userId, week, weekendDayId) => {
  const userInterestRef = ref(
    db,
    makeGameNightPath(`${week}/days/${weekendDayId}/users/${userId}`)
  );
  await runTransaction(userInterestRef, (userInterest) => !userInterest);
};

const getUsersForGameNights = async (week) => {
  const dbRef = ref(db);

  try {
    const resp = await get(child(dbRef, makeGameNightPath(`${week}/days`)));
    return resp.val();
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  sendBombMsgToDB,
  getBombMsgsFromDB,
  addToSlinnVodaScore,
  getSlinnVodaScore,
  bombComboToDB,
  getComboFromDB,
  isUserInCombo,
  storeSchedulingMemeRecord,
  toggleUserInterestForGameNight,
  getUsersForGameNights,
};
