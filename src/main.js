import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/info.js';
import {createTripFiltersElement} from './view/filter.js';
import {createTripEventsSortForm} from './view/sort.js';
import {createAddNewPointTemplate} from './view/add-new-point.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {createEventsListTemplate} from './view/event-list.js';

const POINTS_COUNT = 3;

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
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');
render(tripFiltersElement, createTripFiltersElement(), 'beforeend');
render(tripEventsElement, createTripEventsSortForm(), 'beforeend');
render(tripEventsElement, createEventsListTemplate(), 'beforeend');

const eventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(eventsListElement, createEditPointTemplate(), 'afterbegin');
render(eventsListElement, createAddNewPointTemplate(), 'beforeend');

for (let i=0; i < POINTS_COUNT; i++) {
  render(eventsListElement, createPointTemplate(), 'beforeend');
}
