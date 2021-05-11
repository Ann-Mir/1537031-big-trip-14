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
import Api from './api.js';

const AUTHORIZATION = 'Basic hfbh48fcn9w934avd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

let statisticsComponent = null;

const points = generatePoints(POINTS_COUNT, DESTINATIONS, OFFER_TYPES);

const api = new Api(END_POINT, AUTHORIZATION);

api.getTripEvents().then((tripEvents) => {
  console.log(tripEvents);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

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
const newEventButtonComponent = new NewEventButtonView();

render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
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

newEventButtonComponent.setClickHandler(() => {
  tripEventsBoardPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripEventsBoardPresenter.init();
  tripEventsBoardPresenter.createTripEvent(handleTaskNewFormClose);
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripEventsBoardPresenter.init();
