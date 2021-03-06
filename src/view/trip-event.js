import AbstractView from './abstract.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import {
  humanizeDuration,
  getDuration
} from '../utils/trip-event.js';
import {formatDateAndTime} from '../utils/trip-event.js';
import {DateTimeFormats} from '../utils/constants.js';

const createOffersTemplate = (offers) => {
  const offersList = offers.map((offer) => {
    return `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`;
  }).join('');
  return offersList;
};

const createEventTemplate = (point) => {
  const type = capitalizeFirstLetter(point.type);
  const favoriteButtonClasses = point.isFavorite
    ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  const duration = humanizeDuration(getDuration(point.dateFrom, point.dateTo));

  const offersList = createOffersTemplate(point.offers);
  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${formatDateAndTime(point.dateFrom, DateTimeFormats.FULL_DATE)}">
                ${formatDateAndTime(point.dateFrom, DateTimeFormats.DATE)}
              </time>
              <div class="event__type">
                <img
                  class="event__type-icon"
                  width="42"
                  height="42" src="img/icons/${point.type}.png"
                  alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${point.destination ? point.destination.name : ''}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time
                    class="event__start-time"
                    datetime="${formatDateAndTime(point.dateFrom, DateTimeFormats.FULL_DATE)}T${formatDateAndTime(point.dateFrom, DateTimeFormats.TIME)}">
                      ${formatDateAndTime(point.dateFrom, DateTimeFormats.TIME)}
                  </time>
                  &mdash;
                  <time
                    class="event__end-time"
                    datetime="${formatDateAndTime(point.dateTo, DateTimeFormats.FULL_DATE)}T${formatDateAndTime(point.dateTo, DateTimeFormats.TIME)}">
                      ${formatDateAndTime(point.dateTo, DateTimeFormats.TIME)}
                  </time>
                </p>
                <p class="event__duration">${duration}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
              </p>
              <ul class="event__selected-offers">
                ${offersList}
              </ul>
              <button class="event__favorite-btn ${favoriteButtonClasses}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
          </li>`;
};

export default class TripEvent extends AbstractView {
  constructor(tripEvent) {
    super();
    this._tripEvent = tripEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._tripEvent);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this
      .getElement()
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
}
