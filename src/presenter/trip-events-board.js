import TripEventsBoardView from '../view/trip-events-board.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import TripEventPresenter from './trip-event.js';
import {SortType} from '../utils/constants.js';
import {sortByPrice, sortByTime} from '../utils/trip-event.js';

export default class TripEventsBoard {
  constructor(container, tripEventsModel) {
    this._tripEventsModel = tripEventsModel;
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
  }

  _getTripEvents() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return this._tripEventsModel.getTripEvents().slice().sort(sortByPrice);
      case SortType.TIME:
        return this._tripEventsModel.getTripEvents().slice().sort(sortByTime);
    }
    return this._tripEventsModel.getTripEvents();
  }

  init() {
    render(this._container, this._boardComponent, RenderPosition.AFTERBEGIN);
    render(this._boardComponent, this._tripEventsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsList();
    this._renderBoard();
  }

  _handleModeChange() {
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

  _clearEventsList() {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripEventPresenter = {};
    remove(this._sortComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  _renderBoard() {
    if (this._getTripEvents().length === 0) {
      this._renderNoEvents();
      return ;
    }
    this._renderSort();
    this._renderEvents(this._tripEventsModel);
  }
}
