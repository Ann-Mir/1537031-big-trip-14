import AbstractView from './abstract.js';

const createNoEventTemplate = (storeModel) => {
  return `<p class="trip-events__msg">
            ${(storeModel.getDestinations().length === 0
                || storeModel.getOffers().size === 0)
    ? 'Something went wrong, check connection'
    : 'Click New Event to create your first point'}
          </p>`;
};

export default class NoEvents extends AbstractView {

  constructor(storeModel) {
    super();
    this._storeModel = storeModel;
  }
  getTemplate() {
    return createNoEventTemplate(this._storeModel);
  }

}
