import AbstractView from './abstract.js';
import {SortType} from '../utils/constants.js';

const createTripEventsSortForm = (sortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--day">
              <input id="sort-day" class="trip-sort__input trip-sort__input--enabled visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DAY}" ${sortType === SortType.DAY ? 'checked' : ''}>
              <label class="trip-sort__btn trip-sort__btn--enabled" for="sort-day" data-sort-type="${SortType.DAY}">Day</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input trip-sort__input--enabled visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}" ${sortType === SortType.TIME ? 'checked' : ''}>
              <label class="trip-sort__btn trip-sort__btn--enabled" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input trip-sort__input--enabled visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}" ${sortType === SortType.PRICE ? 'checked' : ''}>
              <label class="trip-sort__btn trip-sort__btn--enabled" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
          </form>`;
};

export default class SortView extends AbstractView {
  constructor(sortType) {
    super();
    this._currentType = sortType;
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripEventsSortForm(this._currentType);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener('click', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (!evt.target.classList.contains('trip-sort__input--enabled')
      && !evt.target.classList.contains('trip-sort__btn--enabled')) {
      return;
    }

    evt.preventDefault();
    this._callback.typeChange(evt.target.dataset.sortType);
  }
}
