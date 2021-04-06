import {sumValues} from '../utils.js';
import dayjs from 'dayjs';

export const createTripInfoTemplate = (points) => {
  const route = points.map((point) => {
    return point.destination.name;
  }).join(' &mdash; ');

  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice = totalPrice + point.offers.map((offer) => offer.price).reduce(sumValues, point.basePrice);
  });

  const getEventPeriod = () => {
    const startingPoint = points[0];
    const endingPoint = points[points.length - 1];
    const monthStart = dayjs(startingPoint.dateFrom).month();
    const monthEnd = dayjs(endingPoint.dateTo).month();
    if (monthStart == monthEnd) {
      return `${dayjs(startingPoint.dateFrom).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(endingPoint.dateTo).format('DD')}`;
    }
    return `${dayjs(startingPoint.dateFrom).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(endingPoint.dateTo).format('MMM DD')}`;
  };
  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${getEventPeriod()}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`;
};

