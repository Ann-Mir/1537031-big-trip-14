import AbstractView from './abstract.js';
import {DEFAULT_POINT, DESTINATIONS, OFFER_TYPES} from '../data.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import {humanizeFullDateAndTime} from '../utils/trip-event.js';

const createOffersTypesTemplate = (availableOffers) => {
  const offerTypesArray = Array.from(availableOffers.keys());
  return offerTypesArray.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type}-${availableOffers.get(type).id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${availableOffers.get(type).id}" data-type="${type}">${capitalizeFirstLetter(type)}</label>
            </div>`;
  }).join('');
};

const createAvailableOffersTemplate = (availableOffers, type, checkedOffers) => {
  const offers = availableOffers.get(type);
  return offers.map((offer) => {
    const isOfferChecked = checkedOffers ? checkedOffers.includes(offer) : false;
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-${offer.title}" data-title="${offer.title}" ${isOfferChecked ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.title}-${offer.title}-${offer.id}" data-title="${offer.title}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  }).join('');
};

const createDestinationsOptionsTemplate = () => {
  return DESTINATIONS.map((destination) => {
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

const createEditPointTemplate = (availableOffers, state) => {
  const {basePrice, type, hasOffers, hasDestination, hasDescription, hasImages, offers, destination, dateFrom, dateTo} = state;
  const typeName = capitalizeFirstLetter(type);
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                          ${createOffersTypesTemplate(availableOffers, type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination ${hasDestination ? '' : 'visually-hidden'}">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${typeName}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${hasDestination ? destination.name : ''}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${createDestinationsOptionsTemplate()}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeFullDateAndTime(dateFrom)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeFullDateAndTime(dateTo)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers ${hasOffers ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                  <div class="event__available-offers">
                    ${hasOffers ? createAvailableOffersTemplate(availableOffers, type, offers) : ''}
                  </div>
                </section>

                <section class="event__section  event__section--destination ${hasDestination ? '' : 'visually-hidden'}">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description ${hasDescription ? '' : 'visually-hidden'}">${destination.description}</p>
                  ${hasImages ? createPhotosList(destination.pictures) : ''}
                </section>
              </section>
            </form>
          </li>`;
};


export default class TripEventEdit extends AbstractView {
  constructor(tripEvent = DEFAULT_POINT) {
    super();
    this._state = TripEventEdit.parseTripEventToState(tripEvent);
    this._availableOfers = OFFER_TYPES;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditFormHandler = this._closeEditFormHandler.bind(this);
    this._eventTypeToggleHandler = this._eventTypeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._priceChangeHAndler = this._priceChangeHAndler.bind(this);
    this._offersSelectionHandler = this._offersSelectionHandler.bind(this);
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('click', this._eventTypeToggleHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('blur', this._destinationToggleHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceChangeHAndler);
    if (this._state.hasOffers) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersSelectionHandler);
    }
  }
  _offersSelectionHandler(evt) {
    const option = evt.target.closest('[data-title]');
    const clickedOfferTitle = option.dataset.title;
    const currentType = (this._state.type);
    const currentOffers = this._state.offers;
    let chosenOffer = currentOffers.find((item) => {
      return item.title === clickedOfferTitle;
    });
    if (chosenOffer) {
      const index = currentOffers.indexOf(chosenOffer);
      currentOffers.splice(index, 1);
    } else {
      chosenOffer = this._availableOfers.get(currentType).find((item) => {
        return item.title === clickedOfferTitle;
      });
      currentOffers.push(chosenOffer);
    }
    this.updateState ({
      offers: currentOffers,
    });
  }

  _priceChangeHAndler(evt) {
    evt.preventDefault();
    const priceFormat = new RegExp(/^\d+$/);
    if (!priceFormat.test(evt.target.value)) {
      evt.target.setCustomValidity('Price should be a whole integer');
      evt.target.reportValidity();
      return;
    }
    this.updateState(
      {
        basePrice: parseInt(evt.target.value, 10),
      }, true);
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const newDestination = DESTINATIONS.find((item) => {
      return item.name === destinationName;
    });

    if (!newDestination) {
      evt.target.setCustomValidity('The destination is unavailable');
      evt.target.reportValidity();
      return;
    }

    this.updateState(
      {
        destination: newDestination,
        hasDestination: newDestination !== null,
        hasDescription: newDestination.description.length > 0,
        hasImages: newDestination.pictures.length !== 0,
      },
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormHandler(this._callback.formClose);
  }

  _eventTypeToggleHandler(evt) {
    evt.preventDefault();
    const type = evt.target.dataset.type;
    const offers = this._availableOfers.get(type);

    this.updateState(
      {
        type,
        hasOffers: offers.length > 0 ? true : false,
      },
    );
  }

  getTemplate() {
    return createEditPointTemplate(this._availableOfers, this._state);
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripEventEdit.parseStateToTripEvent(this._state));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this
      .getElement()
      .querySelector('form')
      .addEventListener('submit', this._formSubmitHandler);
  }

  _closeEditFormHandler(evt) {
    evt.preventDefault();
    this._callback.formClose();
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

  static parseTripEventToState(tripEvent) {
    return Object.assign(
      {},
      tripEvent,
      {
        hasOffers: OFFER_TYPES.get(tripEvent.type).length !== 0,
        hasDestination: tripEvent.destination !== null,
        hasDescription: tripEvent.destination !== null && tripEvent.destination.description.length > 0,
        hasImages: tripEvent.destination !== null && tripEvent.destination.pictures.length !== 0,
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

    return state;
  }
}
