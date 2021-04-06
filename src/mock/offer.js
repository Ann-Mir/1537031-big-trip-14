import {DESCRIPTIONS, getRandomInteger, getRandomValueFromArray, MAX_PRICE, MIN_PRICE, types} from './utils.js';

const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 5;
let offerId = 1;

const getOfferTypes = () => {
  const offerTypes = new Map();

  types.forEach((type) => {
    const offersCount = getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT);
    const offers = [];
    offerId += 1;
    for (let i = 0; i < offersCount; i++) {
      offers.push({
        id: offerId,
        title: getRandomValueFromArray(DESCRIPTIONS),
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      });
    }
    offerTypes.set(type, offers);
  });
  return offerTypes;
};

export { getOfferTypes };
