import {sumValues, getEventPeriod, createElement} from '../utils.js';

const createTripInfoTemplate = (points) => {
  const route = points.map((point) => {
    return point.destination.name;
  }).join(' &mdash; ');

  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice = totalPrice + point.offers.map((offer) => offer.price).reduce(sumValues, point.basePrice);
  });

  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${getEventPeriod(points[0], points[points.length - 1])}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
};

export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
