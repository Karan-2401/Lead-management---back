const randomNumberGenerator = (l, s, e) => {
  let value = "";
  function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  for (let i = 0; i <= l; i++) {
    const number = getRandom(s, e);
    value += String(number);
  }
  return value;
};

module.exports = randomNumberGenerator