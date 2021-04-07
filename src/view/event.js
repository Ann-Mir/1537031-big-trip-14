import {capitalizeFirstLetter, humanizeFullDate, humanizeDuration, humanizeDate, humanizeTime} from '../utils.js';
import {createOffersTemplate} from './offers.js';

export const createEventTemplate = (point) => {
  const type = capitalizeFirstLetter(point.type);
  const favoriteButtonClasses = point.isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';
  const duration = humanizeDuration(point.dateFrom, point.dateTo);

  const offersList = createOffersTemplate(point.offers);
  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeFullDate(point.dateFrom)}">${humanizeDate(point.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${point.destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeFullDate(point.dateFrom)}T${humanizeTime(point.dateFrom)}">${humanizeDate(point.dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeFullDate(point.dateTo)}T${humanizeTime(point.dateTo)}">${humanizeDate(point.dateTo)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <ul class="event__selected-offers">
        ${offersList}
      </ul>
      <button class="${favoriteButtonClasses}" type="button">
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
