const isFourTwenty = (timestamp) => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

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

module.exports = { isFourTwenty, getNiceDate, getNiceTime };
