import {getRandomInteger, getRandomValueFromArray, MAX_PRICE, MIN_PRICE, types} from './utils.js';
import {getRandomDate} from '../utils.js';


const pointId = 0;

const getPoint = (destination, offerTypes) => {
  const firstRandomDate = getRandomDate();
  const secondRandomDate = getRandomDate();
  const point = {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: firstRandomDate < secondRandomDate ? firstRandomDate : secondRandomDate,
    dateTo: firstRandomDate < secondRandomDate ? secondRandomDate : firstRandomDate,
    destination: destination,
    id: pointId + 1,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: getRandomValueFromArray(types),
  };
  const offers = offerTypes.get(point.type);
  point.offers = offers;
  return point;
};

export { getPoint };
