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

  disable() {
    this.getElement().setAttribute('disabled', 'disabled');
  }

  enable() {
    this.getElement().removeAttribute('disabled');
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  setClickHandler(callback) {
    this._callback.buttonClick = callback;
    this
      .getElement()
      .addEventListener('click', this._clickHandler);
  }

}
