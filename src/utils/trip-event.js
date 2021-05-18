import dayjs from 'dayjs';
import {TIMINGS} from './constants.js';

const isEventComing = (point) => {
  const today = dayjs();
  return (today.isBefore(dayjs(point.dateFrom), 'd') || today.isSame(dayjs(point.dateFrom), 'd'));
};

const isEventExpired = (point) => {
  const today = dayjs();
  return today.isAfter(dayjs(point.dateTo), 'd');
};

const humanizeFullDateAndTime = (date) => {
  return dayjs(date).format('DD/MM/YY HH:MM');
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

const getDuration = (startDate, endDate) => {
  return dayjs(endDate).diff(dayjs(startDate));
};

const humanizeDuration = (duration) => {
  let minutes = Math.trunc(duration / TIMINGS.millisecondsPerMinute % TIMINGS.minutesPerHour);
  let hours = Math.trunc(duration / (
    TIMINGS.millisecondsPerMinute * TIMINGS.minutesPerHour) % TIMINGS.hoursPerDay);
  let days = Math.trunc(duration / (
    TIMINGS.millisecondsPerMinute * TIMINGS.minutesPerHour * TIMINGS.hoursPerDay));

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

const sortByPrice = (firstEvent, secondEvent) => {
  return secondEvent.basePrice - firstEvent.basePrice;
};

const sortByTime = (firstEvent, secondEvent) => {
  const firstDuration = getDuration(firstEvent.dateFrom, firstEvent.dateTo);
  const secondDuration = getDuration(secondEvent.dateFrom, secondEvent.dateTo);

  return secondDuration - firstDuration;
};

const sortByDate = (firstEvent, secondEvent) => {
  return firstEvent.dateFrom - secondEvent.dateFrom;
};

export {
  humanizeDay,
  humanizeDuration,
  humanizeTime,
  humanizeDate,
  humanizeFullDate,
  humanizeFullDateAndTime,
  isEventExpired,
  isEventComing,
  sortByPrice,
  sortByTime,
  sortByDate,
  getDuration
};
