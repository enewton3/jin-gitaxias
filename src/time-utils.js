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

/**check to see how long since or until fourTwenty
 * @param {number} Date to check against
 * @return {string} a nicely formatted string of hours, minutes, seconds, millis
 */
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
  const timeSince = {
    hours: millisSince.getUTCHours(),
    minutes: millisSince.getUTCMinutes(),
    seconds: millisSince.getUTCSeconds(),
    millis: millisSince.getUTCMilliseconds(),
  };

  let replyString = [];
  if (timeSince.hours > 0) replyString.push(`${timeSince.hours} hours`);
  if (timeSince.minutes > 0) replyString.push(`${timeSince.minutes} minutes`);
  if (timeSince.seconds > 0) replyString.push(`${timeSince.seconds} seconds`);
  if (timeSince.millis > 0)
    replyString.push(`${timeSince.millis} milliseconds`);

  return replyString.join(", ");
};

module.exports = {
  isFourTwenty,
  getNiceDate,
  getNiceTime,
  timeSinceFourTwenty,
};
