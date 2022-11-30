const { DateTime } = require("luxon");

const isFourTwenty = (timestamp, timezone) => {
  const date = DateTime.fromMillis(timestamp, { zone: timezone });

  if ((date.hour === 16 || date.hour === 4) && date.minute === 20) {
    return true;
  }
  return false;
};

const getNiceDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString();
};

const getNiceTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const getAMorPM = (timestamp, timezone) => {
  const nowDate = DateTime.fromMillis(timestamp, {
    zone: timezone,
  });

  return nowDate.toFormat("a");
};

const calculateFourTwentyProximity = (msgCreatedTimestamp, bombTimezone) => {
  const nowDate = DateTime.fromMillis(msgCreatedTimestamp, {
    zone: bombTimezone,
  });

  const diffUnits = ["hours", "minutes", "seconds", "milliseconds"];

  const tenTwentyPM = nowDate.set({
    hour: 22,
    minute: 20,
    second: 0,
    millisecond: 0,
  });

  if (nowDate > tenTwentyPM) {
    //early for the next day
    const nextDayFourTwentyAM = nowDate
      .plus({ days: 1 })
      .set({ hour: 4, minute: 20 });
    const diff = nextDayFourTwentyAM.diff(nowDate, diffUnits).normalize();

    return { diff, after: false };
  }

  const fourTwentyPM = nowDate.set({
    hour: 16,
    minute: 20,
    second: 0,
    millisecond: 0,
  });
  if (nowDate > fourTwentyPM) {
    //late for 16:20 today
    const diff = nowDate.diff(fourTwentyPM, diffUnits).normalize();
    return { diff, after: true };
  }

  const tenTwentyAM = nowDate.set({
    hour: 10,
    minute: 20,
    second: 0,
    millisecond: 0,
  });
  if (nowDate > tenTwentyAM) {
    //early for 16:20 today
    const diff = fourTwentyPM.diff(nowDate, diffUnits).normalize();
    return { diff, after: false };
  }

  const fourTwentyAM = nowDate.set({
    hour: 4,
    minute: 20,
    second: 0,
    millisecond: 0,
  });
  if (nowDate > fourTwentyAM) {
    //late for 04:20 today
    const diff = nowDate.diff(fourTwentyAM, diffUnits).normalize();
    return { diff, after: true };
  }

  const diff = fourTwentyAM.diff(nowDate, diffUnits).normalize();
  return { diff, after: false };
};

module.exports = {
  isFourTwenty,
  getNiceDate,
  getNiceTime,
  calculateFourTwentyProximity,
  getAMorPM,
};
