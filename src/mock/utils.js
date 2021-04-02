const getRandomInteger = (from, to) => {
  if (from < 0 || to < 0) {
    throw new Error('Non-negative arguments are expected');
  }

  const min = Math.min(from, to);
  const max = Math.max(from, to);

  if (Math.ceil(min) > Math.floor(max)) {
    throw new Error('Input arguments error');
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomFloatWithPrecision = (from, to, decimalPlaces= 1) => {
  if (from < 0 || to < 0) {
    throw new Error('Non-negative arguments are expected');
  }

  const min = Math.min(from, to);
  const max = Math.max(from, to);

  return Number((Math.random() * (max - min) + min).toFixed(decimalPlaces));
};

const getRandomValueFromArray = (arr) => {
  const index = getRandomInteger(0, arr.length - 1);
  return arr[index];
};

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const getRandomLengthArray = (arr) => {
  const length = getRandomInteger(0, arr.length);
  const shuffledArray = new Array(...arr);
  shuffleArray(shuffledArray);
  const result = shuffledArray.slice(0, length);
  return result;
};

export {
  getRandomInteger,
  getRandomFloatWithPrecision,
  getRandomValueFromArray,
  getRandomLengthArray
};
