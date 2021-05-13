import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType, DEFAULT_POINT} from '../utils/constants.js';
import {Mode} from '../utils/constants.js';

export default class TripEventAdd {
  constructor(tripEventsListContainer, storeModel, changeData) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._storeModel = storeModel;
    this._changeData = changeData;
    this._tripEventAddComponent = null;
    this._destroyCallback = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripEventAddComponent !== null) {
      return;
    }

    this._tripEventAddComponent = new TripEventEditView(this._storeModel, DEFAULT_POINT, Mode.ADD);
    this._tripEventAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventAddComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(
      this._tripEventsListContainer,
      this._tripEventAddComponent,
      RenderPosition.AFTERBEGIN,
    );
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    remove(this._tripEventAddComponent);
    this._tripEventAddComponent = null;

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(tripEvent) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      tripEvent,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  setSaving() {
    this._tripEventAddComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }
}
