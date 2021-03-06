export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const DATEPICKER_SETTINGS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  'time_24hr': true,
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
  minBarLength: 85,
  barHeight: 55,
  barThickness: 44,
};

export const StatisticsTitles = {
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

export const Timings = {
  MILLISECONDS_PER_MINUTE: 60000,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  MILLISECONDS_PER_SECOND: 1000,
};

export const OfflineMessages = {
  CONNECTION: 'Connection is lost',
  CREATE: 'You can\'t create new event offline',
  SAVE: 'You can\'t save event offline',
  DELETE: 'You can\'t delete event offline',
  EDIT: 'You can\'t edit event offline',
};

export const DateTimeFormats = {
  FULL_DATE_AND_TIME: 'DD/MM/YY HH:MM',
  FULL_DATE: 'YYYY-MM-DD',
  DATE: 'MMM D',
  DAY: 'DD',
  TIME: 'HH:mm',
};

export const EscapeKeys = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
};

export const AUTHORIZATION = 'Basic hfndj847693odvd';
export const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v14';
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
export const OFFLINE_TITLE = ' [offline]';
