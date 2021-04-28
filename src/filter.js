import {isEventComing, isEventExpired} from './utils/trip-event.js';
import {FilterType} from './utils/constants.js';

const tripEventsFilter = {
  [FilterType.EVERYTHING]: (tripEvents) => {
    return tripEvents;
  },
  [FilterType.PAST]: (tripEvents) => {
    return tripEvents.filter((tripEvent) => isEventExpired(tripEvent));
  },
  [FilterType.FUTURE]: (tripEvents) => {
    return tripEvents.filter((tripEvent) => isEventComing(tripEvent));
  },
};

const generateFilter = (tripEvents) => {
  return Object.entries(tripEventsFilter).map(([filterName, tripEventsCount]) => {
    return {
      name: filterName,
      count: tripEventsCount(tripEvents),
    };
  });
};

export { tripEventsFilter };
