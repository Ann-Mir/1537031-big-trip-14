import TripInfoView from '../view/trip-info.js';
import {humanizeDate, humanizeDay, sortByDate} from '../utils/trip-event.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import dayjs from 'dayjs';

const POINTS_TO_SHOW = 3;

export default class TripInfo {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripInfoComponent = null;
    this._tripEventsModel = tripEventsModel;
    this._totalCost = 0;
    this._route = '';
    this._tripDates = '';

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._tripEventsModel.addObserver(this._handleModelEvent);
  }

  getEventPeriod() {
    const tripEvents = this._tripEventsModel.getTripEvents().sort(sortByDate);
    if (tripEvents.length === 0) {
      return '';
    }
    const startingPoint = tripEvents[0];
    const endingPoint = tripEvents[tripEvents.length - 1];
    const monthStart = dayjs(startingPoint.dateFrom).month();
    const monthEnd = dayjs(endingPoint.dateTo).month();
    if (monthStart === monthEnd) {
      return `${
        humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.dateTo)}`;
    }
    return `${
      humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.dateTo)}`;
  }

  getRoute() {
    const tripEvents = this._tripEventsModel.getTripEvents().sort(sortByDate);
    if (tripEvents.length <= POINTS_TO_SHOW) {
      return tripEvents.map((tripEvent) => {
        return tripEvent.destination.name;
      }).join(' &mdash; ');
    }
    const startingPoint = tripEvents[0];
    const endingPoint = tripEvents[tripEvents.length - 1];
    return `${startingPoint.destination.name} &mdash; ... &mdash; ${endingPoint.destination.name}`;
  }

  init() {
    this._totalCost = this._tripEventsModel.getTotalCost();
    this._route = this.getRoute();
    this._tripDates = this.getEventPeriod();

    this._render();

    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._handleModelEvent();
  }

  _render() {
    remove(this._tripInfoComponent);
    this._tripInfoComponent = new TripInfoView(this._totalCost, this._route, this._tripDates);
    render(
      this._container,
      this._tripInfoComponent,
      RenderPosition.AFTERBEGIN,
    );
  }

  _handleModelEvent() {
    const totalPrice = this._tripEventsModel.getTotalCost();
    const route = this.getRoute();
    const tripDates = this.getEventPeriod();
    if (this._totalCost === totalPrice
      && this._route === route
      && this._tripDates === tripDates) {
      return;
    }
    this._totalCost = totalPrice;
    this._route = route;
    this._tripDates = tripDates;
    this._render();
  }
}
