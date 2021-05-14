import TripEventsModel from './model/trip-events.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(storeModel, endPoint, authorization) {
    this._store = storeModel;
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTripEvents() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((tripEvents) => tripEvents.map(TripEventsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  getData() {
    return Promise.all([
      this.getDestinations(),
      this.getOffers(),
      this.getTripEvents(),
    ])
      .then(([destinations, offers, tripEvents]) => {
        this._store.setDestinations(destinations);
        this._store.setOffers(offers);
        return tripEvents;
      })
      .catch(() => {
        this._store.setDestinations([]);
        this._store.setOffers([]);
        document
          .querySelector('.trip-main__event-add-btn')
          .setAttribute('disabled', 'disabled');
      });
  }

  updateTripEvent(tripEvent) {
    return this._load({
      url: `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(TripEventsModel.adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(TripEventsModel.adaptToClient);
  }

  addTripEvent(tripEvent) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(TripEventsModel.adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(TripEventsModel.adaptToClient);
  }

  deleteTripEvent(tripEvent) {
    return this._load({
      url: `points/${tripEvent.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
