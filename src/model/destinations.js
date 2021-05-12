export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  setDestinations(destinations) {
    offers.forEach((offer) => this._destinations.set(offer.type, offer.offers));
  }

  getDestinations() {
    return this._destinations;
  }
}
