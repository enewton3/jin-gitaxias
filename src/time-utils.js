const isFourTwenty = (timestamp) => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (hours === 16 && minutes === 20) {
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

/// check to see how many seconds since or until fourTwenty
const timeSinceFourTwenty = (currentTime) => {
  const currentTimeDateTime = new Date(currentTime);
  const todayDate = currentTimeDateTime.getDate();
  const todayMonth = currentTimeDateTime.getMonth();
  const todayYear = currentTimeDateTime.getFullYear();

  const fourTwentyToday = new Date(
    todayYear,
    todayMonth,
    todayDate,
    "16",
    "20"
  );

  const millisSince = new Date(currentTimeDateTime - fourTwentyToday);
  const returnObj = {
    hours: millisSince.getUTCHours(),
    minutes: millisSince.getUTCMinutes(),
    seconds: millisSince.getUTCSeconds(),
    millis: millisSince.getUTCMilliseconds(),
  };

  return returnObj;
};

module.exports = {
  isFourTwenty,
  getNiceDate,
  getNiceTime,
  timeSinceFourTwenty,
};
