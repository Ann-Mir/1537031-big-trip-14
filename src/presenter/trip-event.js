import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {cloneObjectValue} from '../utils/common.js';
import {UserAction, UpdateType, OfflineMessages, EscapeKeys} from '../utils/constants.js';
import {isOnline} from '../utils/common.js';
import {showToast} from '../utils/toast.js';
import {getDuration} from '../utils/trip-event.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class TripEvent {
  constructor(container, dataModel, changeData, changeMode) {
    this._container = container;
    this._dataModel = dataModel;
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

  setViewState(state) {
    const resetFormState = () => {
      this._tripEventEditComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripEventEditComponent.updateState({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._tripEventEditComponent.updateState({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._tripEventEditComponent.shake(resetFormState);
        this._tripEventEditComponent.shake(resetFormState);
        break;
    }
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(tripEvent);
    this._tripEventEditComponent = new TripEventEditView(this._dataModel, tripEvent);

    this._tripEventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEventComponent.setEditClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventEditComponent.setCloseEditFormHandler(this._handleEditFormClose);
    this._tripEventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventComponent, prevTripEventEditComponent);
      this._mode = Mode.DEFAULT;
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
    this._tripEventEditComponent.setStartDatePicker();
    this._tripEventEditComponent.setEndDatePicker();
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === EscapeKeys.ESCAPE || evt.key === EscapeKeys.ESC) {
      evt.preventDefault();
      this._tripEventEditComponent.reset(this._tripEvent);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      showToast(OfflineMessages.EDIT);
      return;
    }

    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      showToast(OfflineMessages.SAVE);
      return;
    }
    const isMinorUpdate = (this._tripEvent.dateFrom !== update.dateFrom)
      || (this._tripEvent.basePrice !== update.basePrice)
      || (getDuration(this._tripEvent.dateFrom, this._tripEvent.dateTo)
        !== getDuration(update.dateFrom, update.dateTo));
    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _handleEditFormClose() {
    this._tripEventEditComponent.reset(this._tripEvent);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      cloneObjectValue(
        this._tripEvent,
        {isFavorite: !this._tripEvent.isFavorite}),
    );
  }

  _handleDeleteClick(tripEvent) {
    if (!isOnline()) {
      showToast(OfflineMessages.DELETE);
      return;
    }
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      tripEvent,
    );
  }
}
