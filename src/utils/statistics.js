import {getDuration, humanizeDuration} from './trip-event';

const getUniqueItems = (items) => [...new Set(items)];

const getCostsByTripType = (tripEvents, type) => {
  const eventsByType = tripEvents.filter((tripEvent) => tripEvent.type === type);
  return eventsByType.reduce((sum, item) => sum + item.basePrice, 0);
};

const countEventsByTripType = (tripEvents, type) => {
  return tripEvents.filter((tripEvent) => tripEvent.type === type).length;
};

const getDurationByTripType = (tripEvents, type) => {
  const allTripEventsTypes = tripEvents.filter((tripEvent) => tripEvent.type === type);
  const duration = allTripEventsTypes.reduce((totalDuration, tripEvent) => {
    return totalDuration + getDuration(tripEvent.dateFrom, tripEvent.dateTo);
  }, 0);
  return duration;
};

export {
  getUniqueItems,
  getCostsByTripType,
  countEventsByTripType,
  getDurationByTripType
};
