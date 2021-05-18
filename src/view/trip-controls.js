import AbstractView from './abstract.js';

const createTripControlsTemplate = () => {
  return `<div class="trip-main__trip-controls  trip-controls">
          </div>`;
};

export default class TripControls extends AbstractView {
  getTemplate() {
    return createTripControlsTemplate();
  }
}
