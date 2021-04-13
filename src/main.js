import './utils.js';
import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import SortView from './view/sort.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './data.js';
import {generatePoints} from './mock/point';
import {render, RenderPosition} from './utils.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import FilterView from './view/filter.js';
import NewEventButtonView from './view/new-event-button.js';
import EventView from './view/event.js';
import EventListView from './view/event-list.js';
import EditPointView from './view/edit-point.js';
import NoEventView from './view/no-event.js';

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

const renderEventsList = (listContainer, events) => {
  if (events.length === 0) {
    render(listContainer, new NoEventView().getElement(), RenderPosition.BEFOREEND);
    return ;
  }
  render(tripMainElement, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

  events.forEach((event) => {
    const eventView = new EventView(event);
    const eventViewElement = eventView.getElement();
    render(listContainer, eventViewElement, RenderPosition.BEFOREEND);
    const editPointView = new EditPointView(event);
    const editPointViewElement = editPointView.getElement();
    const rollUpButton = eventViewElement.querySelector('.event__rollup-btn');
    /*const editForm = editPointViewElement.querySelector('form');*/
    const closeFormButton = editPointViewElement.querySelector('.event__rollup-btn');

    const replaceEventWithFrom = () => {
      listContainer.replaceChild(editPointViewElement, eventViewElement);
    };

    const replaceFormWithEvent = () => {
      listContainer.replaceChild(eventViewElement, editPointViewElement);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormWithEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    // closeFormButton.addEventListener('click', () => {
    //   replaceFormWithEvent();
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });

    editPointView.setCloseEditFormHandler(() => {
      replaceFormWithEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    // editForm.addEventListener('submit', (event) => {
    //   event.preventDefault();
    //   replaceFormWithEvent();
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });

    editPointView.setFormSubmitHandler(() => {
      replaceFormWithEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // rollUpButton.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   replaceEventWithFrom();
    //   document.addEventListener('keydown', onEscKeyDown);
    // });

    eventView.setEditClickHandler(() => {
      replaceEventWithFrom();
      document.addEventListener('keydown', onEscKeyDown);
    });
  });
};

render(tripMainElement, tripControlsElement, RenderPosition.AFTERBEGIN);
render(tripControlsElement, tripControlsNavigationElement, RenderPosition.AFTERBEGIN);
render(tripControlsElement, tripControlsFiltersElement, RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, tripFiltersElement, RenderPosition.BEFOREEND);
render(tripMainElement, new NewEventButtonView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsNavigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, eventListElement, RenderPosition.BEFOREEND);
renderEventsList(eventListElement, points);
