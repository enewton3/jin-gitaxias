const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  set,
  get,
  child,
  increment,
} = require("firebase/database");
const { getNiceDate } = require("./time-utils");

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

const sendBombMsgToDB = (payload, username) => {
  try {
    set(
      ref(
        db,
        `/bombMessages/${username}/${payload.niceDate} ${payload.niceTime}`
      ),
      payload
    );
  } catch (e) {
    console.log(e);
  }
};

const getBombMsgsFromDB = async (username) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, `/bombMessages/${username}`));
    if (!resp.val()) return;
    return Object.values(resp.val());
  } catch (e) {
    console.log(e);
  }
};

const addToSlinnVodaScore = (username) => {
  try {
    set(ref(db, `/slinnvodascores/${username}`), increment(1));
  } catch (e) {
    console.log(e);
  }
};

const getSlinnVodaScore = async (username) => {
  const dbRef = ref(db);
  try {
    const resp = await get(child(dbRef, `/slinnvodascores/${username}`));
    if (!resp.val()) return 0;
    return resp.val();
  } catch (e) {
    console.log(e);
  }
};

const bombComboToDB = async () => {
  const today = getNiceDate(Date.now());
  try {
    set(ref(db, `/bombMessages/comboCount/${today}`), increment(1));
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
};
