import {getDuration} from './trip-event.js';

const sortMapByValues = (mapToSort) => {
  const sortedMap = new Map([...mapToSort.entries()]
    .sort((firstEntry, secondEntry) => {
      return secondEntry[1] - firstEntry[1];
    }));
  return sortedMap;
};

const mapEventsByType = (tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let countByType = eventsByType.get(tripEvent.type);
      countByType = countByType + 1;
      eventsByType.set(tripEvent.type, countByType);
    } else {
      eventsByType.set(tripEvent.type, 1);
    }
  });
  return eventsByType;
};

const mapSpendingByType = (tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let spendingByType = eventsByType.get(tripEvent.type);
      spendingByType = spendingByType + tripEvent.basePrice;
      eventsByType.set(tripEvent.type, spendingByType);
    } else {
      eventsByType.set(tripEvent.type, tripEvent.basePrice);
    }
  });
  return eventsByType;
};

const mapDurationByType = (tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let duration = eventsByType.get(tripEvent.type);
      duration = duration + getDuration(tripEvent.dateFrom, tripEvent.dateTo);
      eventsByType.set(tripEvent.type, duration);
    } else {
      eventsByType.set(tripEvent.type, getDuration(tripEvent.dateFrom, tripEvent.dateTo));
    }
  });
  return eventsByType;
};


export {
  sortMapByValues,
  mapEventsByType,
  mapSpendingByType,
  mapDurationByType
};
