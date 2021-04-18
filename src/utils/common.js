import {getRandomInteger} from '../mock/utils.js';
import dayjs from 'dayjs';

const MIN_DAYS_GAP = -7;
const MAX_DAYS_GAP = 7;

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const cloneObjectValue = (obj, value) => {
  return Object.assign(
    {},
    obj,
    value,
  );
};


export {
  getRandomDate,
  capitalizeFirstLetter,
  updateItem,
  cloneObjectValue,
  MIN_DAYS_GAP,
  MAX_DAYS_GAP
};
