import AbstractView from './abstract.js';

const createNewEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
            New event
          </button>`;
};

export default class NewEventButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButtonTemplate();
  }

  _clickHandler() {

  }

  setClickHandler(callback) {
    this._callback.buttonClock = callback;
    this
      .getElement()
      .querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this._clickHandler);
  }
}
