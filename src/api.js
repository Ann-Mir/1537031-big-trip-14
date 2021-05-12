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
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTripEvents() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((tripEvents) => tripEvents.map(TripEventsModel.adaptToClient));
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
