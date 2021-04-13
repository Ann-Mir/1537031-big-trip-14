import dayjs from 'dayjs';

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

const getEventPeriod = (startingPoint, endingPoint) => {
  const monthStart = dayjs(startingPoint.dateFrom).month();
  const monthEnd = dayjs(endingPoint.dateTo).month();
  if (monthStart == monthEnd) {
    return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.dateTo)}`;
  }
  return `${humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.dateTo)}`;
};

export {
  getEventPeriod,
  humanizeDay,
  humanizeDuration,
  humanizeTime,
  humanizeDate,
  humanizeFullDate,
  humanizeFullDateAndTime,
  isEventExpired,
  isEventComing,
  sumValues
};
