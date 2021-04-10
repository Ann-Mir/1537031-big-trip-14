import './utils.js';
import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import SortView from './view/sort.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './data.js';
import {generatePoints} from './mock/point';
import {renderElement, RenderPosition} from './utils.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import FilterView from './view/filter.js';
import NewEventButtonView from './view/new-event-button.js';
import EventView from './view/event.js';
import EventListView from './view/event-list.js';
import EditPointView from './view/edit-point.js';

const points = generatePoints(POINTS_COUNT, DESTINATIONS, OFFER_TYPES);

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = new TripControlsView().getElement();
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigationElement = new TripControlsNavigationView().getElement();
const tripControlsFiltersElement = new TripControlsFiltersView().getElement();
const tripFiltersElement = new FilterView().getElement();
const eventListElement = new EventListView().getElement();
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

renderElement(tripMainElement, tripControlsElement, RenderPosition.AFTERBEGIN);
renderElement(tripControlsElement, tripControlsNavigationElement, RenderPosition.AFTERBEGIN);
renderElement(tripControlsElement, tripControlsFiltersElement, RenderPosition.BEFOREEND);
renderElement(tripControlsFiltersElement, tripFiltersElement, RenderPosition.BEFOREEND);
renderElement(tripMainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripMainElement, new NewEventButtonView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripControlsNavigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEventsElement, eventListElement, RenderPosition.BEFOREEND);

points.forEach((point) => {
  const eventViewElement = new EventView(point).getElement();
  renderElement(eventListElement, eventViewElement, RenderPosition.BEFOREEND);
  const editPointViewElement = new EditPointView(point).getElement();
  const rollUpButton = eventViewElement.querySelector('.event__rollup-btn');
  const editForm = editPointViewElement.querySelector('form');

  const replaceEventWithFrom = () => {
    eventListElement.replaceChild(editPointViewElement, eventViewElement);
  };

  const replaceFormWithEvent = () => {
    eventListElement.replaceChild(eventViewElement, editPointViewElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormWithEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    replaceFormWithEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  rollUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    replaceEventWithFrom();
    document.addEventListener('keydown', onEscKeyDown);
  });
});

