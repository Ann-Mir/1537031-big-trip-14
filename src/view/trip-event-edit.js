import {capitalizeFirstLetter} from '../utils/common.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import he from 'he';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {DATEPICKER_SETTINGS, DEFAULT_POINT, Mode, DateTimeFormats} from '../utils/constants.js';
import {formatDateAndTime} from '../utils/trip-event.js';

const createRollUpButtonTemplate = (mode) => {
  return mode === Mode.EDIT ? `<button class="event__rollup-btn" type="button">
                                <span class="visually-hidden">Open event</span>
                               </button>`: '';
};

const createOffersTypesTemplate = (availableOffers, currentType, isDisabled) => {
  const offerTypesArray = Array.from(availableOffers.keys());
  return offerTypesArray.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type}-${availableOffers.get(type).id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${availableOffers.get(type).id}" data-type="${type}">${capitalizeFirstLetter(type)}</label>
            </div>`;
  }).join('');
};

const createAvailableOffersTemplate = (availableOffers, type, checkedOffers, isDisabled) => {
  const offers = availableOffers.get(type);
  return offers.map((offer) => {
    const isOfferChecked = checkedOffers ? checkedOffers.some((eventOffer) => eventOffer.title === offer.title && eventOffer.price === offer.price) : false;
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" data-title="${offer.title}" ${isOfferChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.title}-${offer.title}-1" data-title="${offer.title}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  }).join('');
};

const createDestinationsOptionsTemplate = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  }).join('');
};

const createPhotosList = (photosList) => {
  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photosList.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`)}
  </div>
</div>`;
};

const createEditPointTemplate = (availableOffers, destinations, state, mode= Mode.EDIT) => {
  const {
    basePrice,
    type,
    hasOffers,
    hasDestination,
    hasDescription,
    hasImages,
    offers,
    destination,
    dateFrom,
    dateTo,
    isDisabled,
    isSaving,
    isDeleting,
  } = state;

  const checkDeletingMode = (mode, isDeleting) => {
    if (mode === Mode.ADD) {
      return 'Cancel';
    }
    if (isDeleting) {
      return 'Deleting';
    }
    return 'Delete';
  };

  const typeName = capitalizeFirstLetter(type);
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                          ${createOffersTypesTemplate(availableOffers, type, isDisabled)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${typeName}
                  </label>
                  <input
                    class="event__input  event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value="${hasDestination ? he.encode(destination.name) : ''}"
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}
                    required
                  >
                  <datalist id="destination-list-1">
                    ${createDestinationsOptionsTemplate(destinations)}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateAndTime(dateFrom, DateTimeFormats.FULL_DATE_AND_TIME)}" ${isDisabled ? 'disabled' : ''} required>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateAndTime(dateTo, DateTimeFormats.FULL_DATE_AND_TIME)}" ${isDisabled ? 'disabled' : ''} required>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" step="1" name="event-price" value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''} required>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${checkDeletingMode(mode, isDeleting)}</button>
                ${createRollUpButtonTemplate(mode)}
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers ${hasOffers ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                    ${hasOffers ? createAvailableOffersTemplate(availableOffers, type, offers, isDisabled) : ''}
                  </div>
                </section>

                <section class="event__section  event__section--destination ${hasDestination ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description ${hasDescription ? '' : 'visually-hidden'}">${hasDescription ? destination.description : ''}</p>
                  ${hasImages ? createPhotosList(destination.pictures) : ''}
                </section>
              </section>
            </form>
          </li>`;
};

export default class TripEventEdit extends SmartView {
  constructor(dataModel, tripEvent = DEFAULT_POINT, mode = Mode.EDIT) {
    super();
    this._dataModel = dataModel;
    this._state = TripEventEdit.parseTripEventToState(tripEvent, this._dataModel.getOffers());
    this._mode = mode;

    this._startDatePicker = null;
    this._endDatePicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditFormHandler = this._closeEditFormHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._priceChangeHAndler = this._priceChangeHAndler.bind(this);
    this._offersSelectionHandler = this._offersSelectionHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._dataModel.getOffers(), this._dataModel.getDestinations(), this._state, this._mode);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._formDeleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this
      .getElement()
      .querySelector('form')
      .addEventListener('submit', this._formSubmitHandler);
  }

  setCloseEditFormHandler(callback) {
    if (this.getElement().querySelector('.event__rollup-btn')) {

      this._callback.formClose = callback;
      this
        .getElement()
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this._closeEditFormHandler);
    }
  }

  setStartDatePicker() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    this._startDatePicker = flatpickr(
      this.getElement().querySelector('input[name="event-start-time"]'),
      Object.assign(
        {},
        DATEPICKER_SETTINGS,
        {
          defaultDate: this._state.dateFrom,
          onClose: this._startDateChangeHandler,
        },
      ),
    );
  }

  setEndDatePicker() {
    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._endDatePicker = flatpickr(
      this.getElement().querySelector('input[name="event-end-time"]'),
      Object.assign(
        {},
        DATEPICKER_SETTINGS,
        {
          minDate: this._state.dateFrom,
          defaultDate: this._state.dateTo,
          onClose: this._endDateChangeHandler,
        },
      ),
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('click', this._eventTypeToggleHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationToggleHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHAndler);
    if (this._state.hasOffers) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersSelectionHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setStartDatePicker();
    this.setEndDatePicker();
  }

  reset(tripEvent) {
    this.updateState(
      TripEventEdit.parseTripEventToState(tripEvent, this._dataModel.getOffers()),
    );
    this.removeDatePicker();
  }

  removeDatePicker() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  removeElement() {
    this.removeDatePicker();
    super.removeElement();
  }

  _startDateChangeHandler([userDate]) {
    const startDate = userDate ? userDate : new Date();
    this.updateState({
      dateFrom: startDate,
      dateTo: startDate > this._state.dateTo ? startDate : this._state.dateTo,
    });
  }

  _endDateChangeHandler([userDate]) {
    const endDate = userDate ? userDate : new Date();
    this.updateState({
      dateFrom: endDate< this._state.dateFrom ? endDate : this._state.dateFrom,
      dateTo: endDate,
    });
  }

  _offersSelectionHandler(evt) {
    if (!evt.target.closest('.event__offer-selector')) {
      return;
    }
    const clickedOfferTitle = evt.target.closest('[data-title]').dataset.title;
    const availableOffersByType = this._dataModel.getOffers().get(this._state.type);
    const currentOffers = this._state.offers;

    const chosenOffer = availableOffersByType.find(
      (item) => item.title.toLowerCase() === clickedOfferTitle.toLowerCase());

    const selectedOffers = currentOffers.find(
      (item) => item.title.toLowerCase() === clickedOfferTitle.toLowerCase()) ?
      currentOffers.filter((item) => item.title !== clickedOfferTitle) :
      [...currentOffers.slice(), chosenOffer];

    this.updateState ({
      offers: selectedOffers,
    });
  }

  _priceChangeHAndler(evt) {
    evt.preventDefault();
    evt.target.reportValidity();
    this.updateState(
      {
        basePrice: Number(evt.target.value),
      }, true);
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const newDestination = this._dataModel.getDestinations().find((item) => item.name === destinationName);

    if (!newDestination) {
      evt.target.setCustomValidity('The destination is unavailable');
      evt.target.reportValidity();
      return;
    }

    this.updateState(
      {
        destination: newDestination,
        hasDestination: newDestination !== null,
        hasDescription: newDestination && newDestination.description.length > 0,
        hasImages: newDestination.pictures.length !== 0,
      },
    );
  }

  _eventTypeToggleHandler(evt) {
    evt.preventDefault();
    const type = evt.target.dataset.type;
    if (!type) {
      return;
    }
    const availableOffers = this._dataModel.getOffers().get(type);
    const offers = type === this._state.type ? this._state.offers : [];

    this.updateState(
      {
        offers,
        type,
        hasOffers: !!(availableOffers && availableOffers.length > 0),
      },
    );
  }

  _formSubmitHandler(evt) {
    this.removeDatePicker();
    evt.preventDefault();
    this._callback.formSubmit(TripEventEdit.parseStateToTripEvent(this._state));
  }

  _closeEditFormHandler(evt) {
    this.removeDatePicker();
    evt.preventDefault();
    this._callback.formClose();
  }

  _formDeleteClickHandler(evt) {
    this.removeDatePicker();
    evt.preventDefault();
    this._callback.deleteClick(TripEventEdit.parseStateToTripEvent(this._state));
  }

  static parseTripEventToState(tripEvent, availableOffers) {
    return Object.assign(
      {},
      tripEvent,
      {
        hasOffers: availableOffers.size > 0 && availableOffers.get(tripEvent.type).length !== 0,
        hasDestination: tripEvent.destination !== null,
        hasDescription: tripEvent.destination !== null && tripEvent.destination.description.length > 0,
        hasImages: tripEvent.destination !== null && tripEvent.destination.pictures.length !== 0,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToTripEvent(state) {
    state = Object.assign({}, state);

    if (!state.hasOffers) {
      state.offers = [];
    }

    if (!state.hasDestination) {
      state.destination = null;
    }

    if (state.hasDestination && !state.hasImages) {
      state.destination.pictures = [];
    }

    delete state.hasImages;
    delete state.hasOffers;
    delete state.hasDestination;
    delete state.hasDescription;
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }
}
