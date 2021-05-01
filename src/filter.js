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

export { tripEventsFilter };
