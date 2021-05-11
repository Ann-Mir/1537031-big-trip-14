import Observer from '../utils/observer.js';

export default class TripEvents extends Observer {
  constructor() {
    super();
    this._tripEvents = [];
  }

  setTripEvents(tripEvents) {
    this._tripEvents = tripEvents.slice();
  }

  getTripEvents() {
    return this._tripEvents;
  }

  updateTripEvent(updateType, update) {
    const index = this._tripEvents.findIndex(
      (tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      update,
      ...this._tripEvents.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTripEvent(updateType, update) {
    this._tripEvents = [
      update,
      ...this._tripEvents,
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    const index = this._tripEvents.findIndex(
      (tripEvent) => tripEvent.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      ...this._tripEvents.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(tripEvent) {
    const adaptedTripEvent = Object.assign(
      {},
      tripEvent,
      {
        basePrice: Number(tripEvent.base_price),
        dateFrom: tripEvent.date_from !== null ? new Date(tripEvent.date_from) : tripEvent.date_from,
        dateTo: tripEvent.date_to !== null ? new Date(tripEvent.date_to) : tripEvent.date_to,
        isFavorite: tripEvent.is_favorite,
      },
    );

    delete adaptedTripEvent.base_price;
    delete adaptedTripEvent.date_from;
    delete adaptedTripEvent.date_to;
    delete adaptedTripEvent.is_favorite;

    return adaptedTripEvent;
  }

  static adaptToServer(tripEvent) {
    const adaptedTripEvent = Object.assign(
      {},
      tripEvent,
      {
        'base_price': tripEvent.basePrice,
        'date_from': tripEvent.dateFrom instanceof Date ? tripEvent.dateFrom.toISOString() : null,
        'date_to': tripEvent.dateTo instanceof Date ? tripEvent.dateTo.toISOString() : null,
        'is_favorite': tripEvent.isFavorite,
      },
    );

    delete adaptedTripEvent.basePrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.isFavorite;
    delete adaptedTripEvent.dateTo;

    return adaptedTripEvent;
  }
}
