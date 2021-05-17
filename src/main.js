import SiteMenuView from './view/site-menu.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import NewEventButtonView from './view/new-event-button.js';
import TripEventsBoardPresenter from './presenter/trip-events-board.js';
import StatisticsView from './view/statistics.js';
import {render, RenderPosition} from './utils/render.js';
import {isOnline} from './utils/common.js';
import TripEventsModel from './model/trip-events.js';
import FilterModel from './model/filter.js';
import DataModel from './model/data.js';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/trip-info.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {MenuItem} from './utils/constants.js';
import {FilterType, UpdateType} from './utils/constants.js';
import {remove} from './utils/render.js';
import Api from './api/api.js';
import {showToast} from './utils/toast.js';

const AUTHORIZATION = 'Basic hfbh48fcn9w934avd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let statisticsComponent = null;

const tripEventsModel = new TripEventsModel();
const filterModel = new FilterModel();
const dataModel = new DataModel();

const api = new Api(dataModel, END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const siteHeaderElement = document.querySelector('.page-header');
const tripControls = new TripControlsView();
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigation = new TripControlsNavigationView();
const tripControlsFilters = new TripControlsFiltersView();
const siteMainElement = document.querySelector('.page-main');
const bodyContainerElement = siteMainElement.querySelector('.page-body__container');
const tripEventsBoardPresenter = new TripEventsBoardPresenter(
  bodyContainerElement,
  tripEventsModel,
  dataModel,
  filterModel,
  apiWithProvider,
);

const siteMenuComponent = new SiteMenuView();

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, tripEventsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, tripEventsModel);

tripEventsBoardPresenter.init();

const newEventButtonComponent = new NewEventButtonView();

render(tripMainElement, tripControls, RenderPosition.BEFOREEND);
render(tripControls, tripControlsNavigation, RenderPosition.AFTERBEGIN);
render(tripControls, tripControlsFilters, RenderPosition.BEFOREEND);
render(tripMainElement, newEventButtonComponent, RenderPosition.BEFOREEND);
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
      remove(statisticsComponent);
      statisticsComponent = new StatisticsView(tripEventsModel.getTripEvents());
      render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const handleTaskNewFormClose = () => {
  remove(statisticsComponent);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleNewEventButtonClick = () => {
  tripEventsBoardPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripEventsBoardPresenter.init();
  if (!isOnline()) {
    showToast('You can\'t create new event offline');
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    return;
  }
  tripEventsBoardPresenter.createTripEvent(handleTaskNewFormClose);
};

apiWithProvider
  .getData()
  .then((tripEvents) => tripEventsModel.setTripEvents(UpdateType.INIT, tripEvents))
  .catch(() => tripEventsModel.setTripEvents(UpdateType.INIT, []))
  .finally(() => {
    tripInfoPresenter.init();
    filterPresenter.init();
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    newEventButtonComponent.setClickHandler(handleNewEventButtonClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
