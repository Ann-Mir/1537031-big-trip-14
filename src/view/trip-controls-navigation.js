import {createElement} from '../utils.js';

const createTripControlsNavigationTemplate = () => {
  return `<div class="trip-controls__navigation">
              <h2 class="visually-hidden">Switch trip view</h2>
              <!-- Меню -->
            </div>`;
};

export default class TripControlsNavigation {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripControlsNavigationTemplate();
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
