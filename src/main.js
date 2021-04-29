import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import {DESTINATIONS, OFFER_TYPES, POINTS_COUNT} from './data.js';
import {generatePoints} from './mock/point.js';
import TripControlsView from './view/trip-controls.js';
import TripControlsNavigationView from './view/trip-controls-navigation.js';
import TripControlsFiltersView from './view/trip-controls-filters.js';
import FilterView from './view/filter.js';
import NewEventButtonView from './view/new-event-button.js';
import TripEventsBoardPresenter from './presenter/trip-events-board.js';
import {render, RenderPosition} from './utils/render.js';
import TripEventsModel from './model/trip-events.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import {tripEventsFilter} from './filter.js';
import {MenuItem} from './utils/constants.js';
import {FilterType, UpdateType} from './utils/constants';

const points = generatePoints(POINTS_COUNT, DESTINATIONS, OFFER_TYPES);

const tripEventsModel = new TripEventsModel();
tripEventsModel.setTripEvents(points);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.page-header');
const tripControls = new TripControlsView();
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsNavigation = new TripControlsNavigationView();
const tripControlsFilters = new TripControlsFiltersView();
//const tripFilters = new FilterView(filters, 'all');
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
//render(tripControlsFilters, new FilterView(tripEventsFilter, 'all'), RenderPosition.BEFOREEND);
render(tripMainElement, new NewEventButtonView(), RenderPosition.BEFOREEND);
render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);



const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripEventsBoardPresenter.init();
      // Скрыть статистику
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.STATS:
      tripEventsBoardPresenter.destroy();
      // Показать доску
      // Скрыть статистику
      break;
  }
};

const handleTaskNewFormClose = () => {
  // siteMenuComponent.getElement().querySelector(`#${MenuItem.TABLE}`).classList.add('trip-tabs__btn--active');
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
