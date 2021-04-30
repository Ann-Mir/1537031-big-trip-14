import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './data.js';
import {generatePoints} from './mock/point.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import NewEventButtonView from './view/new-event-button.js';
import TripEventsBoardPresenter from './presenter/trip-events-board.js';
import StatisticsView from './view/statistics.js';
import {render, RenderPosition} from './utils/render.js';
import TripEventsModel from './model/trip-events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import {MenuItem} from './utils/constants.js';
import {FilterType, UpdateType} from './utils/constants.js';
import {remove} from './utils/render.js';


let statisticsComponent = null;

const points = generatePoints(POINTS_COUNT, DESTINATIONS, OFFER_TYPES);

const tripEventsModel = new TripEventsModel();
tripEventsModel.setTripEvents(points);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripControls = new TripControlsView();
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigation = new TripControlsNavigationView();
const tripControlsFilters = new TripControlsFiltersView();
const siteMainElement = document.querySelector('.page-main');
const bodyContainerElement = siteMainElement.querySelector('.page-body__container');
const tripEventsBoardPresenter = new TripEventsBoardPresenter(bodyContainerElement, tripEventsModel, filterModel);
const siteMenuComponent = new SiteMenuView();

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, tripEventsModel);
filterPresenter.init();

const tripInfoComponent = new TripInfoView(points);

render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripMainElement, tripControls, RenderPosition.BEFOREEND);
render(tripControls, tripControlsNavigation, RenderPosition.AFTERBEGIN);
render(tripControls, tripControlsFilters, RenderPosition.BEFOREEND);
render(tripMainElement, new NewEventButtonView(), RenderPosition.BEFOREEND);
render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);


const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripEventsBoardPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripEventsBoardPresenter.destroy();
      statisticsComponent = new StatisticsView(tripEventsModel.getTripEvents());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const handleTaskNewFormClose = () => {
  remove(statisticsComponent);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};


document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripEventsBoardPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripEventsBoardPresenter.init();
  tripEventsBoardPresenter.createTripEvent(handleTaskNewFormClose);
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripEventsBoardPresenter.init();
