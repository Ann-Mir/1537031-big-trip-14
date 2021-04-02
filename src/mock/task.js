import {
  getRandomInteger,
  getRandomFloatWithPrecision,
  getRandomValueFromArray,
  getRandomLengthArray
} from './utils.js';

const types = new Set ([
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
]);

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const DESTINATION_NAMES = new Set([
  'Amsterdam',
  'Rome',
  'Singapore',
  'Los-Angeles',
  'Moscow',
  'Paris',
  'London',
  'Sydney',
  'Tokyo',
  'Zurich',
  'Prague',
  'Minsk',
  'Milan',
  'New-York',
]);

const MIN_PICTURES_COUNT = 0;
const MAX_PICTURES_COUNT = 7;
const MIN_PRICE = 10;
const MAX_PRICE = 10000;
const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;

const getDescription = () => {
  return getRandomLengthArray(DESCRIPTIONS).join(' ');
};

const getPictures = () => {
  const pictures = [];
  const picturesCount = getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT);
  for (let i = 0; i < picturesCount; i++) {
    const picture = {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT)}`,
      description: getRandomValueFromArray(DESCRIPTIONS),
    };
    pictures.push(picture);
  }
  return pictures;
};

const getDestination = () => {
  const pictures = getPictures();
  const destination = {
    description: getDescription(),
    name: getRandomValueFromArray(DESTINATION_NAMES),
  };
  destination.pictures = pictures;
  DESTINATION_NAMES.delete(destination.name);
  return destination;
};

const getOfferTypes = () => {
  const offerTypes = new Map();

  types.forEach((type) => {
    const offersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
    const offers = [];
    for (let i = 0; i < offersCount; i++) {
      offers.push({
        title: getRandomValueFromArray(DESCRIPTIONS);
        price: getRandomInteger(MIN_PRICE, MAX_PRICE);
      })
    }
    offerTypes.set(type, offers);
  });

  return offerTypes;
}

const offerTypes = getOfferTypes();

const getPoint = () => {
  const destination = getDestination();
  const point = {
    base_price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    date_from: '2019-07-10T22:55:56.845Z',
    date_to: '2019-07-11T11:22:13.375Z',
    destination: destination,
    id: 0,
    is_favorite: false,
    offers: [
      {
        title: 'Choose meal',
        price: 180,
      }, {
        title: 'Upgrade to comfort class',
        price: 50,
      },
    ],
    type: 'bus',
  };
};

