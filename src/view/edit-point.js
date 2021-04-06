import {capitalizeFirstLetter} from '../utils.js';
import dayjs from 'dayjs';
import {DEFAULT_POINT, DESTINATIONS, OFFER_TYPES} from '../constants.js';

const createOffersTypesTemplate = (currentOfferType) => {
  const offerTypesArray = Array.from(OFFER_TYPES.keys());
  return offerTypesArray.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type}-${OFFER_TYPES.get(type).id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentOfferType ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${OFFER_TYPES.get(type).id}">${capitalizeFirstLetter(type)}</label>
            </div>`;
  }).join('');
};

const createAvailableOffersTemplate = (offers) => {
  return offers.map((offer) => {
    return `<div class="event__available-offers">
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-${offer.title}">
                <label class="event__offer-label" for="event-offer-${offer.title}-${offer.title}-${offer.id}">
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

export const createEditPointTemplate = (point=DEFAULT_POINT) => {

  const type = capitalizeFirstLetter(point.type);
  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                    ${createOffersTypesTemplate(point.type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationsOptionsTemplate()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(point.dateFrom).format('DD/MM/YY HH:MM')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(point.dateTo).format('DD/MM/YY HH:MM')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${createAvailableOffersTemplate(point.offers)}
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${point.destination.description}</p>
          </section>
        </section>
      </form>
    </li>`;
};
