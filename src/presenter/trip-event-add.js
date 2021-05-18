import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {
  UserAction,
  UpdateType,
  DEFAULT_POINT,
  OfflineMessages,
  Mode
} from '../utils/constants.js';
import {isOnline} from '../utils/common.js';
import {showToast} from '../utils/toast.js';

export default class TripEventAdd {
  constructor(container, newEventButtonComponent, dataModel, changeData) {
    this._container = container;
    this._newEventButtonComponent = newEventButtonComponent;
    this._tripEventAddComponent = null;
    this._destroyCallback = null;

    this._dataModel = dataModel;
    this._changeData = changeData;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  setSaving() {
    this._tripEventAddComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEventAddComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this._tripEventAddComponent.shake(resetFormState);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripEventAddComponent !== null) {
      return;
    }

    this._tripEventAddComponent = new TripEventEditView(this._dataModel, DEFAULT_POINT, Mode.ADD);
    this._tripEventAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventAddComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(
      this._container,
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
      this._newEventButtonComponent.enable();
      this.destroy();
    }
  }

  _handleFormSubmit(tripEvent) {
    if (!isOnline()) {
      showToast(OfflineMessages.SAVE);
      return;
    }

    this._newEventButtonComponent.enable();

    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      tripEvent,
    );
  }

  _handleDeleteClick() {
    this._newEventButtonComponent.enable();
    this.destroy();
  }
}
