import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import SortView from './view/sort.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './data.js';
import {generatePoints} from './mock/point.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import FilterView from './view/filter.js';
import NewEventButtonView from './view/new-event-button.js';
import EventView from './view/event.js';
import EventListView from './view/event-list.js';
import EditPointView from './view/edit-point.js';
import NoEventView from './view/no-event.js';
import TripEventsBoardView from './view/trip-events-board.js';
import {render, RenderPosition} from './utils/render.js';
import {replace} from './utils/render.js';

const points = generatePoints(POINTS_COUNT, DESTINATIONS, OFFER_TYPES);

const siteHeaderElement = document.querySelector('.page-header');
const tripControls = new TripControlsView();
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigation = new TripControlsNavigationView();
const tripControlsFilters = new TripControlsFiltersView();
const tripFilters = new FilterView();
const eventList = new EventListView();
const siteMainElement = document.querySelector('.page-main');
const bodyContainerElement = siteMainElement.querySelector('.page-body__container');
const tripEventsBoard = new TripEventsBoardView();

const renderEventsList = (listContainer, events) => {
  if (events.length === 0) {
    render(listContainer, new NoEventView(), RenderPosition.BEFOREEND);
    return ;
  }
  render(tripMainElement, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  render(tripEventsBoard, new SortView(), RenderPosition.AFTERBEGIN);

  events.forEach((event) => {
    const eventView = new EventView(event);
    render(listContainer, eventView, RenderPosition.BEFOREEND);
    const editPointView = new EditPointView(event);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replace(eventView, editPointView);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    editPointView.setCloseEditFormHandler(() => {
      replace(eventView, editPointView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointView.setFormSubmitHandler(() => {
      replace(eventView, editPointView);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventView.setEditClickHandler(() => {
      replace(editPointView, eventView);
      document.addEventListener('keydown', onEscKeyDown);
    });
  });
};

render(bodyContainerElement, tripEventsBoard, RenderPosition.AFTERBEGIN);
render(tripMainElement, tripControls, RenderPosition.AFTERBEGIN);
render(tripControls, tripControlsNavigation, RenderPosition.AFTERBEGIN);
render(tripControls, tripControlsFilters, RenderPosition.BEFOREEND);
render(tripControlsFilters, tripFilters, RenderPosition.BEFOREEND);
render(tripMainElement, new NewEventButtonView(), RenderPosition.BEFOREEND);
render(tripControlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripEventsBoard, eventList, RenderPosition.BEFOREEND);
renderEventsList(eventList, points);
