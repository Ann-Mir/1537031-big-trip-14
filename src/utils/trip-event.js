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

const getDuration = (startDate, endDate) => {
  return dayjs(endDate).diff(dayjs(startDate));
};

const formatDateAndTime = (date, format) => {
  return dayjs(date).format(format);
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
  formatDateAndTime,
  humanizeDuration,
  isEventExpired,
  isEventComing,
  sortByPrice,
  sortByTime,
  sortByDate,
  getDuration
};
