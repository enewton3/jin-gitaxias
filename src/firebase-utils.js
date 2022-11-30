const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  get,
  child,
  increment,
} = require("firebase/database");
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

const messagesPath = makePathMaker("bombMessages");
const slinnVodaPath = makePathMaker("slinnVodaScores");
const comboPath = makePathMaker("comboCounts");

const sendBombMsgToDB = (payload) => {
  try {
    set(
      ref(db, messagesPath(`${payload.authorId}/${payload.messageId}`)),
      payload
    );
  } catch (e) {
    console.log(e);
  }
};

const getBombMsgsFromDB = async (userId) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, messagesPath(userId)));
    if (!resp.val()) return;
    return Object.values(resp.val());
  } catch (e) {
    console.log(e);
  }
};

const addToSlinnVodaScore = (userId) => {
  try {
    set(ref(db, slinnVodaPath(userId)), increment(1));
  } catch (e) {
    console.log(e);
  }
};

const getSlinnVodaScore = async (userId) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, slinnVodaPath(userId)));
    if (!resp.val()) return 0;
    return resp.val();
  } catch (e) {
    console.log(e);
  }
};

const bombComboToDB = async (msgTimestamp, timezone) => {
  const nowDate = DateTime.fromMillis(msgTimestamp, {
    zone: timezone,
  });
  try {
    set(
      ref(
        db,
        comboPath(
          `${timezone}/${nowDate.toLocaleString(
            DateTime.DATE_SHORT
          )}/${nowDate.toFormat("a")}`
        )
      ),
      increment(1)
    );
  } catch (e) {
    console.log(e);
  }
};

const getComboNumberFromDB = async (dateInTimezone) => {
  const dbRef = ref(db);

  try {
    const resp = await get(
      child(
        dbRef,
        comboPath(
          `${dateInTimezone.zoneName}/${dateInTimezone.toLocaleString(
            DateTime.DATE_SHORT
          )}/${dateInTimezone.toFormat("a")}`
        )
      )
    );
    if (!resp.val()) return 0;
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
  getComboNumberFromDB,
};
