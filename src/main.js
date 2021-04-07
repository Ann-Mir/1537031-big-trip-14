import './utils.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/info.js';
import {createTripFiltersElement} from './view/filter.js';
import {createTripEventsSortForm} from './view/sort.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createEventTemplate} from './view/event.js';
import {createEventsListTemplate} from './view/event-list.js';
import {getPoint} from './mock/point.js';
import {getRandomInteger} from './mock/utils.js';
import {generateFilter} from './filter.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './constants.js';

const points = new Array(POINTS_COUNT)
  .fill()
  .map(
    () => {
      return getPoint(DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)], OFFER_TYPES);
    })
  .sort((point1, point2) => {
    return point1.dateFrom - point2.dateFrom;
  });

generateFilter(points);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');

const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripControlsElement, createSiteMenuTemplate(), 'beforeend');
render(tripMainElement, createTripInfoTemplate(points), 'afterbegin');
render(tripFiltersElement, createTripFiltersElement(), 'beforeend');
render(tripEventsElement, createTripEventsSortForm(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(eventsListElement, createEditPointTemplate(points[0]), 'afterbegin');
render(eventsListElement, createEditPointTemplate(), 'beforeend');

points.forEach((point) => {
  render(eventsListElement, createEventTemplate(point), 'beforeend');
});

