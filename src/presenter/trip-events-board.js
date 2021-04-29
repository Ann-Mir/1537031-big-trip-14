import TripEventsBoardView from '../view/trip-events-board.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import TripEventPresenter from './trip-event.js';
import TripEventAddPresenter from './trip-event-add.js';
import {areDatesEqual, sortByPrice, sortByTime} from '../utils/trip-event.js';
import {SortType, UpdateType, UserAction} from '../utils/constants.js';
import {tripEventsFilter} from '../filter.js';
import {FilterType} from '../utils/constants.js';

export default class TripEventsBoard {
  constructor(container, tripEventsModel, filterModel) {
    this._tripEventsModel = tripEventsModel;
    this._filterModel = filterModel;
    this._container = container;
    this._tripEventPresenter = {};
    this._boardComponent = new TripEventsBoardView();
    this._tripEventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._tripEventAddPresenter = new TripEventAddPresenter(this._tripEventsListComponent, this._handleViewAction);
  }

  createTripEvent(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._tripEventAddPresenter.init(callback);
  }

  _getTripEvents() {
    const filterType = this._filterModel.getFilter();
    const tripEvents = this._tripEventsModel.getTripEvents();
    const filteredTripEvents = tripEventsFilter[filterType](tripEvents);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredTripEvents.sort(sortByPrice);
      case SortType.TIME:
        return filteredTripEvents.sort(sortByTime);
    }
    return filteredTripEvents.sort(areDatesEqual);
  }

  init() {
    render(this._container, this._boardComponent, RenderPosition.AFTERBEGIN);
    render(this._boardComponent, this._tripEventsListComponent, RenderPosition.BEFOREEND);

    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._handleModelEvent(UpdateType.MAJOR);
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._tripEventsListComponent);
    remove(this._boardComponent);

    this._tripEventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleModeChange() {
    this._tripEventAddPresenter.destroy();
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(
      this._tripEventsListComponent,
      this._handleViewAction,
      this._handleModeChange,
    );
    tripEventPresenter.init(tripEvent);
    this._tripEventPresenter[tripEvent.id] = tripEventPresenter;
  }

  _renderEvents() {
    this._getTripEvents().forEach((tripEvent) => {
      this._renderEvent(tripEvent);
    });
  }

  _renderNoEvents() {
    render(this._tripEventsListComponent, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._tripEventsModel.updateTripEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._tripEventsModel.addTripEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._tripEventsModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripEventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _renderBoard() {
    if (this._getTripEvents().length === 0) {
      this._renderNoEvents();
      return ;
    }
    this._renderSort();
    this._renderEvents(this._tripEventsModel);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._tripEventAddPresenter.destroy();

    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripEventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
