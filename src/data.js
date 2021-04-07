import {getOfferTypes} from './mock/offer.js';
import {getPoint} from './mock/point.js';
import {getDestinations} from './mock/destination.js';

const POINTS_COUNT = 20;
const DESTINATIONS_COUNT = 30;

const OFFER_TYPES = getOfferTypes();
const DESTINATIONS = getDestinations(DESTINATIONS_COUNT);
const DEFAULT_POINT = getPoint(DESTINATIONS[0], OFFER_TYPES);

export {
  DEFAULT_POINT,
  POINTS_COUNT,
  OFFER_TYPES,
  DESTINATIONS
};
