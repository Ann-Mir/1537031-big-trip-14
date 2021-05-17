import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {cloneObjectValue} from '../utils/common.js';
import {UserAction, UpdateType} from '../utils/constants.js';
import {isOnline} from '../utils/common.js';
import {showToast} from '../utils/toast.js';

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
  constructor(tripEventsListContainer, dataModel, changeData, changeMode) {
    this._tripEventsListContainer = tripEventsListContainer;
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
      render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
      this._mode = Mode.DEFAULT;
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
    if (!isOnline()) {
      showToast('You can\'t edit event offline');
      return;
    }

    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      showToast('You can\'t save event offline');
      return;
    }

    const isMinorUpdate = this._tripEvent.dateFrom !== update.dateFrom;
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
    if (!isOnline()) {
      showToast('You can\'t delete event offline');
      return;
    }
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      tripEvent,
    );
  }
}
