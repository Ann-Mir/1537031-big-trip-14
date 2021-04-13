import AbstractView from './abstract.js';

const createNewEventButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
            New event
          </button>`;
};

export default class NewEventButton extends AbstractView {

  getTemplate() {
    return createNewEventButtonTemplate();
  }

}
