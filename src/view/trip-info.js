import AbstractView from './abstract.js';
import {getEventPeriod, sumValues} from '../utils/event';

const POINTS_TO_SHOW = 3;

const createTripInfoTemplate = (points) => {
  let route = '';
  if (points.length <= POINTS_TO_SHOW) {
    route = points.map((point) => {
      return point.destination.name;
    }).join(' &mdash; ');
  } else {
    const startingPoint = points[0];
    const endingPoint = points[points.length - 1];
    route = `${startingPoint.destination.name} — ... — ${endingPoint.destination.name}`;
  }

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

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}

