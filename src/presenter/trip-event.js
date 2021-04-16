import TripEventView from '../view/trip-event.js';
import TripEventEditView from '../view/trip-event-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripEvent {
  constructor(tripEventsListContainer) {
    this._tripEventsListContainer = tripEventsListContainer;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(tripEvent);
    this._tripEventEditComponent = new TripEventEditView(tripEvent);

    this._tripEventComponent.setEditClickHandler(this._handleEditClick);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
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

  _replaceCardToForm() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }
}
