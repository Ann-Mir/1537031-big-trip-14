import {isEventComing, isEventExpired} from './utils.js';

const pointsToFilterMap = {
  everything: (points) => {
    return points.length;
  },
  past: (points) => {
    return points.filter((point) => isEventExpired(point)).length;
  },
  future: (points) => {
    return points.filter((point) => isEventComing(point)).length;
  },
};

const generateFilter = (points) => {
  return Object.entries(pointsToFilterMap).map(([filterName, pointsCount]) => {
    return {
      name: filterName,
      count: pointsCount(points),
    };
  });
};

export { generateFilter };
