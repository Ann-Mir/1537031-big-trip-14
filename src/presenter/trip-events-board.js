import TripEventsBoardView from '../view/trip-events-board.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {render, RenderPosition} from '../utils/render.js';
import TripEventPresenter from './trip-event.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/constants.js';
import {sortByPrice, sortByTime} from '../utils/trip-event.js';

export default class TripEventsBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._tripEventPresenter = {};
    this._boardComponent = new TripEventsBoardView();
    this._sortComponent = new SortView();
    this._tripEventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleTripEventEdit = this._handleTripEventEdit.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventsList) {
    this._eventsList = eventsList.slice();
    this._sourcedEventsList = eventsList.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.AFTERBEGIN);
    render(this._boardComponent, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortEvents(sortType);
    this._clearEventsList();
    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(
      this._tripEventsListComponent,
      this._handleTripEventEdit,
      this._handleModeChange,
    );
    tripEventPresenter.init(tripEvent);
    this._tripEventPresenter[tripEvent.id] = tripEventPresenter;
  }

  _renderEvents(events) {
    events.forEach((event) => {
      this._renderEvent(event);
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
  }

  _handleTripEventEdit(updatedTripEvent) {
    this._eventsList = updateItem(this._eventsList, updatedTripEvent);
    this._sourcedEventsList = updateItem(this._sourcedEventsList, updatedTripEvent);
    this._tripEventPresenter[updatedTripEvent.id].init(updatedTripEvent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._eventsList.sort(sortByPrice);
        break;
      case SortType.TIME:
        this._eventsList.sort(sortByTime);
        break;
      default:
        this._eventsList = this._sourcedEventsList.slice();
    }

    this._currentSortType = sortType;
  }

  _renderBoard() {
    if (this._eventsList === 0) {
      this._renderNoEvents();
      return ;
    }
    this._renderSort();
    this._renderEvents(this._eventsList);
  }
}
