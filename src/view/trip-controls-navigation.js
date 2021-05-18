import AbstractView from './abstract.js';

const createTripControlsNavigationTemplate = () => {
  return `<div class="trip-controls__navigation">
            <h2 class="visually-hidden">Switch trip view</h2>
          </div>`;
};

export default class TripControlsNavigation extends AbstractView {

  getTemplate() {
    return createTripControlsNavigationTemplate();
  }

}
