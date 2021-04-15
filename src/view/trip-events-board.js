import AbstractView from './abstract.js';

const createTripEventsBoardTemplate = () => {
  return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>

            <!-- Сортировка -->

            <!-- Контент -->
          </section>`;
};

export default class TripEventsBoard extends AbstractView {

  getTemplate() {
    return createTripEventsBoardTemplate();
  }

}
