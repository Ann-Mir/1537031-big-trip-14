import {DESCRIPTIONS, getRandomInteger, getRandomLengthArray, getRandomValueFromArray} from './utils.js';

const MIN_PICTURES_COUNT = 0;
const MAX_PICTURES_COUNT = 5;

const destinationNames = new Set(['Amsterdam', 'Rome', 'Singapore', 'Los-Angeles', 'Moscow', 'Paris',
  'London', 'Sydney', 'Tokyo', 'Zurich', 'Prague', 'Minsk', 'Milan', 'New-York', 'Bangkok', 'Vienna',
  'Baku', 'Brussels', 'Sofia', 'Ottawa', 'Beijing', 'Bogota', 'Zagreb', 'Havana', 'Nicosia',
  'Copenhagen', 'Santo Domingo', 'Quito', 'Cairo', 'San Salvador', 'Tallinn', 'Helsinki', 'Tbilisi',
  'Berlin', 'Athens', 'Budapest', 'Reykjavik', 'Jakarta', 'Dublin', 'Riga', 'Vilnius', 'Luxembourg',
]);

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
  const destinations = Array.from(destinationNames);
  const pictures = getPictures();
  const destination = {
    description: getDescription(),
    name: getRandomValueFromArray(destinations),
  };
  destination.pictures = pictures;
  destinationNames.delete(destination.name);
  return destination;
};

const getDestinations = (destinationsCount) => {
  const destinations = [];
  for (let i = 0; i < destinationsCount; i++) {
    const destination = getDestination();
    destinations.push(destination);
  }
  return destinations;
};

export { getDestinations };
