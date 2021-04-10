const types = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet.',
  'Cras aliquet varius magna',
  'Aliquam id orci ut lectus varius viverra.',
  'Phasellus eros mauris, condimentum sed nibh vitae.',
  'Sed blandit, eros vel aliquam faucibus.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const MIN_PRICE = 10;
const MAX_PRICE = 10000;

const getRandomInteger = (from, to) => {
  const min = Math.min(from, to);
  const max = Math.max(from, to);

  if (Math.ceil(min) > Math.floor(max)) {
    throw new Error('Input arguments error');
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
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
  const length = getRandomInteger(1, arr.length);
  const shuffledArray = new Array(...arr);
  shuffleArray(shuffledArray);
  const result = shuffledArray.slice(0, length);
  return result;
};

const replaceChildElement = (parentElement, newChild, oldChild) => {
  return (event) => {
    event.preventDefault();
    parentElement.replaceChild(newChild, oldChild);
  };
};

export {
  MIN_PRICE,
  MAX_PRICE,
  DESCRIPTIONS,
  types,
  getRandomInteger,
  getRandomValueFromArray,
  getRandomLengthArray,
  replaceChildElement
};
