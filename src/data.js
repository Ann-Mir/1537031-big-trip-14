import {getOfferTypes} from './mock/offer.js';
import {getDestinations} from './mock/destination.js';

const POINTS_COUNT = 20;
const DESTINATIONS_COUNT = 30;

const OFFER_TYPES = getOfferTypes();
const DESTINATIONS = getDestinations(DESTINATIONS_COUNT);
export {
  POINTS_COUNT,
  OFFER_TYPES,
  DESTINATIONS
};
