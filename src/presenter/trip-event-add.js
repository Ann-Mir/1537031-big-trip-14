import TripEventView from '../view/trip-event.js';
import {nanoid} from 'nanoid';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType, DEFAULT_POINT} from '../utils/constants.js';
import {Mode} from '../utils/constants';

export default class TripEventAdd {
  constructor(tripEventsListContainer, changeData) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._changeData = changeData;
    this._tripEventAddComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._tripEventAddComponent !== null) {
      return;
    }

    this._tripEventAddComponent = new TripEventView(DEFAULT_POINT, Mode.ADD);
    this._tripEventAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripEventAddComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._tripEventsListContainer , this._tripEventAddComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    remove(this._tripEventAddComponent);
    this._tripEventAddComponent = null;

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
      Object.assign({id: nanoid()}, tripEvent),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
