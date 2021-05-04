import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {cloneObjectValue} from '../utils/common.js';
import {UserAction, UpdateType} from '../utils/constants.js';
import {sortByDate} from '../utils/trip-event.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripEvent {
  constructor(tripEventsListContainer, changeData, changeMode) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEditFormClose = this._handleEditFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(tripEvent);
    this._tripEventEditComponent = new TripEventEditView(tripEvent);

    this._tripEventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEventComponent.setEditClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setCloseEditFormHandler(this._handleEditFormClose);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    if (this._tripEventsListContainer.getElement().contains(prevTripEventComponent.getElement())) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._tripEventsListContainer.getElement().contains(prevTripEventEditComponent.getElement())) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._tripEventEditComponent.reset(this._tripEvent);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !(sortByDate(this._tripEvent.dateFrom, update.dateFrom) === 0);

    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this._replaceFormToCard();
  }

  _handleEditFormClose() {
    this._tripEventEditComponent.reset(this._tripEvent);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      cloneObjectValue(
        this._tripEvent,
        {isFavorite: !this._tripEvent.isFavorite}),
    );
  }

  _handleDeleteClick(tripEvent) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      tripEvent,
    );
  }
}
