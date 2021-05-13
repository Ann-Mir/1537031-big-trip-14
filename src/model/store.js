export default class Store {
  constructor() {
    this._offers = new Map();
    this._destinations = [];
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
  }

  getOffers() {
    return this._offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }
}
