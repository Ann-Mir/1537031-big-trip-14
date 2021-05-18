import SiteMenuView from './view/site-menu.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import NewEventButtonView from './view/new-event-button.js';
import StatisticsView from './view/statistics.js';
import {remove, render, RenderPosition} from './utils/render.js';
import {isOnline} from './utils/common.js';
import TripEventsModel from './model/trip-events.js';
import FilterModel from './model/filter.js';
import DataModel from './model/data.js';
import FilterPresenter from './presenter/filter.js';
import TripInfoPresenter from './presenter/trip-info.js';
import TripEventsBoardPresenter from './presenter/trip-events-board.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {
  AUTHORIZATION,
  END_POINT,
  FilterType,
  MenuItem,
  OFFLINE_TITLE,
  STORE_NAME,
  UpdateType,
  OfflineMessages
} from './utils/constants.js';
import Api from './api/api.js';
import {showToast} from './utils/toast.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const bodyContainerElement = siteMainElement.querySelector('.page-body__container');

const tripEventsModel = new TripEventsModel();
const filterModel = new FilterModel();
const dataModel = new DataModel();

const api = new Api(dataModel, END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tripControlsComponent = new TripControlsView();
const tripControlsNavigationComponent = new TripControlsNavigationView();
const tripControlsFiltersComponent = new TripControlsFiltersView();
const newEventButtonComponent = new NewEventButtonView();
const siteMenuComponent = new SiteMenuView();

const tripEventsBoardPresenter = new TripEventsBoardPresenter(
  bodyContainerElement,
  tripEventsModel,
  dataModel,
  filterModel,
  newEventButtonComponent,
  apiWithProvider,
);
const filterPresenter = new FilterPresenter(tripControlsFiltersComponent, filterModel, tripEventsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, tripEventsModel);

let statisticsComponent = null;

tripEventsBoardPresenter.init();

render(tripMainElement, tripControlsComponent, RenderPosition.BEFOREEND);
render(tripControlsComponent, tripControlsNavigationComponent, RenderPosition.AFTERBEGIN);
render(tripControlsComponent, tripControlsFiltersComponent, RenderPosition.BEFOREEND);
render(tripMainElement, newEventButtonComponent, RenderPosition.BEFOREEND);
render(tripControlsNavigationComponent, siteMenuComponent, RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      newEventButtonComponent.enable();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripEventsBoardPresenter.init();
      siteMenuComponent.setItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripEventsBoardPresenter.destroy();
      newEventButtonComponent.disable();
      filterPresenter.disable();
      remove(statisticsComponent);
      statisticsComponent = new StatisticsView(tripEventsModel.getTripEvents());
      render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setItem(MenuItem.STATS);
      break;
  }
};

const handleTaskNewFormClose = () => {
  newEventButtonComponent.enable();
  remove(statisticsComponent);
  siteMenuComponent.setItem(MenuItem.TABLE);
};

const handleNewEventButtonClick = () => {
  tripEventsBoardPresenter.destroy();
  newEventButtonComponent.disable();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripEventsBoardPresenter.init();
  if (!isOnline()) {
    showToast(OfflineMessages.CREATE);
    siteMenuComponent.setItem(MenuItem.TABLE);
    return;
  }
  tripEventsBoardPresenter.createTripEvent(handleTaskNewFormClose);
};

const handleDataReceived = () => {
  filterPresenter.init();
  tripInfoPresenter.init();
  siteMenuComponent.setClickHandler(handleSiteMenuClick);
  newEventButtonComponent.setClickHandler(handleNewEventButtonClick);
};

apiWithProvider
  .getData()
  .then((tripEvents) => tripEventsModel.setTripEvents(UpdateType.INIT, tripEvents))
  .catch(() => tripEventsModel.setTripEvents(UpdateType.INIT, []))
  .finally(handleDataReceived);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  newEventButtonComponent.enable();
  document.title = document.title.replace(OFFLINE_TITLE, '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  newEventButtonComponent.disable();
  showToast(OfflineMessages.CONNECTION);
  document.title += OFFLINE_TITLE;
});
