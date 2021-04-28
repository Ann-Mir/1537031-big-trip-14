import {getPoint} from '../mock/point';
import {DESTINATIONS, OFFER_TYPES} from '../data';
import {getRandomInteger, getRandomValueFromArray, MAX_PRICE, MIN_PRICE, types} from '../mock/utils';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const DATEPICKER_SETTINGS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  time_24hr: true,
  minDate: 'today',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const Mode = {
  EDIT: 'edit',
  ADD: 'add',
};

//export const DEFAULT_POINT = getPoint(DESTINATIONS[0], OFFER_TYPES);
export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  id: nanoid(),
  isFavorite: false,
  type: 'taxi',
  offers: [],
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};
