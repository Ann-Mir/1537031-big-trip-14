export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const DATEPICKER_SETTINGS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  time_24hr: true,
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const STATISTICS_SETTINGS = {
  type: 'horizontalBar',
  backgroundColor: '#ffffff',
  hoverBackgroundColor: '#ffffff',
  dataAnchor: 'start',
  basicFontSize: 13,
  datalabelsColor: '#000000',
  fontColor: '#000000',
  datalabelsAnchor: 'end',
  datalabelsAlign: 'start',
  titleFontSize: 23,
  titlePosition: 'left',
  padding: 5,
  minBarLength: 75,
  barHeight: 55,
  barThickness: 44,

};

export const StatiscticsTitles = {
  TYPE: 'TYPE',
  MONEY: 'MONEY',
  TIME_SPENT: 'TIME-SPENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
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

export const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  isFavorite: false,
  type: 'taxi',
  offers: [],
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const TIMINGS = {
  millisecondsPerMinute: 60000,
  minutesPerHour: 60,
  hoursPerDay: 24,
};

export const AUTHORIZATION = 'Basic hfbh48fcn9w934avd';
export const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v14';
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
export const OFFLINE_TITLE = ' [offline]';
