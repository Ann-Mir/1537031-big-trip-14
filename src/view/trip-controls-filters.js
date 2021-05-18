import AbstractView from './abstract.js';

const createTripControlsFiltersTemplate = () => {
  return `<div class="trip-controls__filters">
            <h2 class="visually-hidden">Filter events</h2>
          </div>`;
};

export default class TripControlsFilters extends AbstractView {
  getTemplate() {
    return createTripControlsFiltersTemplate();
  }
}
