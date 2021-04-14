import {getRandomInteger} from '../mock/utils.js';
import dayjs from 'dayjs';

export const MIN_DAYS_GAP = -7;
export const MAX_DAYS_GAP = 7;

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const getRandomDate = () => {
  const minutes = getRandomInteger(1, 60);
  const hours = getRandomInteger(1, 24);
  const daysGap = getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs()
    .add(daysGap, 'day')
    .add(minutes, 'm')
    .add(hours, 'hour')
    .toDate();
};

export {
  getRandomDate,
  capitalizeFirstLetter
};