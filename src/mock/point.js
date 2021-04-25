import {getRandomInteger, getRandomValueFromArray, MAX_PRICE, MIN_PRICE, types} from './utils.js';
import {getRandomDate} from '../utils/common.js';
import {getRandomLengthArray} from './utils.js';


let pointId = 0;

const getPoint = (destination, offerTypes) => {
  const firstRandomDate = getRandomDate();
  const secondRandomDate = getRandomDate();
  pointId += 1;
  const point = {
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: firstRandomDate < secondRandomDate ? firstRandomDate : secondRandomDate,
    dateTo: firstRandomDate < secondRandomDate ? secondRandomDate : firstRandomDate,
    destination: destination,
    id: pointId,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: getRandomValueFromArray(types),
  };
  const offers = getRandomLengthArray(offerTypes.get(point.type));
  point.offers = offers;
  return point;
};

const generatePoints = (pointsCount, destinations, offerTypes) => {
  const points = new Array(pointsCount)
    .fill()
    .map(
      () => {
        return getPoint(destinations[getRandomInteger(0, destinations.length - 1)], offerTypes);
      })
    .sort((point1, point2) => {
      return point1.dateFrom - point2.dateFrom;
    });
  return points;
};

export { getPoint, generatePoints };
