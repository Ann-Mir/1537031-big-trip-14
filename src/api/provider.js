import TripEventsModel from '../model/trip-events.js';
import {isOnline} from '../utils/common.js';

const getSyncedTripEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {

  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getData() {
    if (isOnline()) {
      return this._api.getData()
        .then((tripEvents) => {
          const items = createStoreStructure(tripEvents.map(TripEventsModel.adaptToServer));
          this._store.setItems(items);
          return tripEvents;
        });
    }

    const storeTripEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeTripEvents.map(TripEventsModel.adaptToClient));
  }

  updateTripEvent(tripEvent) {
    if (isOnline()) {
      return this._api.updateTripEvent(tripEvent)
        .then((updatedTripEvent) => {
          this._store.setItem(updatedTripEvent.id, TripEventsModel.adaptToServer(updatedTripEvent));
          return updatedTripEvent;
        });
    }

    this._store.setItem(tripEvent.id, TripEventsModel.adaptToServer(Object.assign({}, tripEvent)));

    return Promise.resolve(tripEvent);
  }

  addTripEvent(tripEvent) {
    if (isOnline()) {
      return this._api.addTripEvent(tripEvent)
        .then((newTripEvent) => {
          this._store.setItem(newTripEvent.id, TripEventsModel.adaptToServer(newTripEvent));
          return newTripEvent;
        });
    }

    return Promise.reject(new Error('Adding trip event failed'));
  }

  deleteTripEvent(tripEvent) {
    if (isOnline()) {
      return this._api.deleteTripEvent(tripEvent)
        .then(() => this._store.removeItem(tripEvent.id));
    }

    return Promise.reject(new Error('Deleting trip event failed'));
  }

  sync() {
    if (isOnline()) {
      const storeTripEvents = Object.values(this._store.getItems());

      return this._api.sync(storeTripEvents)
        .then((response) => {
          const createdTripEvents = getSyncedTripEvents(response.created);
          const updatedTripEvents = getSyncedTripEvents(response.updated);
          const items = createStoreStructure([...createdTripEvents, ...updatedTripEvents]);

          this._store.setItems(items);
        });
    }
    return Promise.reject(new Error('Sync data failed'));
  }

}
