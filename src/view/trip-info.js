import AbstractView from './abstract.js';

const createTripInfoTemplate = (totalCost, route, tripDates) => {

  return `<section class="trip-main__trip-info  trip-info ${route === '' ? 'visually-hidden' : ''}">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>

              <p class="trip-info__dates">${tripDates}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
            </p>
          </section>`;
};

export default class TripInfo extends AbstractView {

  constructor(totalCost, route, tripDates) {
    super();
    this._totalCost = totalCost;
    this._route = route;
    this._tripDates = tripDates;
  }

  getTemplate() {
    return createTripInfoTemplate(this._totalCost, this._route, this._tripDates);
  }

}

