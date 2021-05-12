export default class Offers {
  constructor() {
    this._offers = new Map();
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
  }

  getOffers() {
    return this._offers;
  }
}
