const { minBy } = require("lodash");
const { DateTime } = require("luxon");

// must be less than 12
const BOMB_TIME_HOUR_AM = 4;
const BOMB_TIME_HOUR_PM = BOMB_TIME_HOUR_AM + 12;
const BOMB_TIME_MINUTE = 20;

const matchesBombHour = (hour) =>
  hour === BOMB_TIME_HOUR_AM || hour === BOMB_TIME_HOUR_PM;

const isFourTwenty = (timestamp, timezone) => {
  const date = DateTime.fromMillis(timestamp, { zone: timezone });

  if (matchesBombHour(date.hour) && date.minute === BOMB_TIME_MINUTE) {
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

  const potentialFourTwentyDates = [
    // Yesterday PM
    nowDate.minus({ days: 1 }).set({
      hour: BOMB_TIME_HOUR_PM,
      minute: BOMB_TIME_MINUTE,
      second: 0,
      millisecond: 0,
    }),
    // Today AM
    nowDate.set({
      hour: BOMB_TIME_HOUR_AM,
      minute: BOMB_TIME_MINUTE,
      second: 0,
      millisecond: 0,
    }),
    // Today PM
    nowDate.set({
      hour: BOMB_TIME_HOUR_PM,
      minute: BOMB_TIME_MINUTE,
      second: 0,
      millisecond: 0,
    }),
    // Tomorrow AM
    nowDate.plus({ days: 1 }).set({
      hour: BOMB_TIME_HOUR_AM,
      minute: BOMB_TIME_MINUTE,
      second: 0,
      millisecond: 0,
    }),
  ];

  const closestDate = minBy(potentialFourTwentyDates, (date) =>
    Math.abs(nowDate.diff(date).milliseconds)
  );

  if (closestDate > nowDate) {
    return {
      diff: closestDate.diff(nowDate, diffUnits).normalize(),
      after: false,
    };
  }

  return {
    diff: nowDate.diff(closestDate, diffUnits).normalize(),
    after: true,
  };
};

module.exports = {
  isFourTwenty,
  getNiceDate,
  getNiceTime,
  calculateFourTwentyProximity,
  getAMorPM,
  matchesBombHour,
  BOMB_TIME_MINUTE,
};
