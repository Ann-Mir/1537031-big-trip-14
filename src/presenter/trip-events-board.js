import TripEventsBoardView from '../view/trip-events-board.js';
import SortView from '../view/sort.js';
import EventsListView from '../view/events-list.js';
import NoEventsView from '../view/no-events.js';
import {render, RenderPosition, replace} from '../utils/render';
import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import TripEventPresenter from './trip-event.js';

export default class TripEventsBoard {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._boardComponent = new TripEventsBoardView();
    this._sortComponent = new SortView();
    this._tripEventsListComponent = new EventsListView();
    this._noEventsComponent = new NoEventsView();
  }

  init(eventsList) {
    this._eventsList = eventsList.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.AFTERBEGIN);
    render(this._boardComponent, this._tripEventsListComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const tripEventPresenter = new TripEventPresenter(this._tripEventsListComponent);
    tripEventPresenter.init(event);
    // const eventView = new TripEventView(event);
    // render(this._tripEventsListComponent, eventView, RenderPosition.BEFOREEND);
    // const editPointView = new TripEventEditView(event);
    //
    // const onEscKeyDown = (evt) => {
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     replace(eventView, editPointView);
    //     document.removeEventListener('keydown', onEscKeyDown);
    //   }
    // };
    //
    // editPointView.setCloseEditFormHandler(() => {
    //   replace(eventView, editPointView);
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });
    //
    // editPointView.setFormSubmitHandler(() => {
    //   replace(eventView, editPointView);
    //   document.removeEventListener('keydown', onEscKeyDown);
    // });
    //
    // eventView.setEditClickHandler(() => {
    //   replace(editPointView, eventView);
    //   document.addEventListener('keydown', onEscKeyDown);
    // });
  }

  _renderEvents(events) {
    events.forEach((event) => {
      this._renderEvent(event);
    });
  }

  _renderNoEvents() {
    render(this._tripEventsListComponent, this._noEventsComponent, RenderPosition.BEFOREEND);
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
