import {UpdateType} from '../utils/constants';
import TripInfoView from '../view/trip-info.js';
import {humanizeDate, humanizeDay} from '../utils/trip-event.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import dayjs from 'dayjs';

const POINTS_TO_SHOW = 3;

export default class TripInfo {
  constructor(container, tripEventsModel) {
    this._tripEventsModel = tripEventsModel;
    this._totalCost = 0;
    this._route = '';
    this._tripDates = '';
    this._container = container;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._tripEventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._totalCost = this._tripEventsModel.getTotalCost();
    this._route = this.getRoute();
    this._tripDates = this.getEventPeriod();
    this._renderTripInfo();

    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._handleModelEvent(UpdateType.MAJOR);
  }

  getEventPeriod() {
    if (this._tripEventsModel.getTripEvents().length === 0) {
      return '';
    }
    const tripEvents = this._tripEventsModel.getTripEvents();
    const startingPoint = tripEvents[0];
    const endingPoint = tripEvents[tripEvents.length - 1];
    const monthStart = dayjs(startingPoint.dateFrom).month();
    const monthEnd = dayjs(endingPoint.dateTo).month();
    if (monthStart == monthEnd) {
      return `${
        humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDay(endingPoint.dateTo)}`;
    }
    return `${
      humanizeDate(startingPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(endingPoint.dateTo)}`;
  }

  getRoute() {
    const tripEvents = this._tripEventsModel.getTripEvents();
    if (tripEvents.length <= POINTS_TO_SHOW) {
      return tripEvents.map((tripEvent) => {
        return tripEvent.destination.name;
      }).join(' &mdash; ');
    }
    const startingPoint = tripEvents[0];
    const endingPoint = tripEvents[tripEvents.length - 1];
    return `${startingPoint.destination.name} &mdash; ... &mdash; ${endingPoint.destination.name}`;
  }

  _renderTripInfo() {
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
    this._renderTripInfo();
  }
}
