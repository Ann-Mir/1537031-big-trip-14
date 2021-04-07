import dayjs from 'dayjs';
import {getRandomInteger} from './mock/utils.js';

const MIN_DAYS_GAP = -7;
const MAX_DAYS_GAP = 7;

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const sumValues = (accumulator, currentValue) => {
  return accumulator + currentValue;
};

const isEventComing = (point) => {
  const today = dayjs();
  return (today.isAfter(dayjs(point.dateFrom), 'd') || today.isSame(dayjs(point.dateFrom), 'd'));
};

const isEventExpired = (point) => {
  const today = dayjs();
  return today.isBefore(dayjs(point.dateFrom), 'd');
};

const humanizeFullDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const humanizeDate = (date) => {
  return dayjs(date).format('MMM D');
};

const humanizeTime = (date) => {
  return dayjs(date).format('HH:mm');
};

const humanizeDuration = (dateFrom, dateTo) => {
  const milliseconds = dayjs(dateTo).diff(dayjs(dateFrom));
  let minutes = parseInt(milliseconds / (1000 * 60) % 60);
  let hours = parseInt(milliseconds / (1000 * 60 * 60) % 24);
  let days = parseInt(milliseconds / (1000 * 60 * 60 * 24));

  days = (days < 10) ? '0' + days : days;
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;

  if (days === 0 || days === '00') {
    return `${hours}H ${minutes}M`;
  }
  if ((days === 0 || days === '00') && (hours === 0 || hours === '00')) {
    return `${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

const humanizeDay = (date) => {
  return dayjs(date).format('DD');
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

const getEventPeriod = (startingPoint, endingPoint) => {
  const monthStart = dayjs(startingPoint.dateFrom).month();
  const monthEnd = dayjs(endingPoint.dateTo).month();
  if (monthStart == monthEnd) {
    return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.dateTo)}`;
  }
  return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.dateTo)}`;
};

export {
  capitalizeFirstLetter,
  sumValues,
  humanizeDuration,
  isEventComing,
  isEventExpired,
  getRandomDate,
  humanizeFullDate,
  humanizeDate,
  humanizeTime,
  humanizeDay,
  getEventPeriod
};
