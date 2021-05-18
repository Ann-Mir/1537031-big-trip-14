import AbstractView from './abstract.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (`<div class="trip-filters__filter">
            <input
             id="filter-${name}"
             class="trip-filters__filter-input  visually-hidden"
             type="radio" name="trip-filter" ${type === currentFilterType ? 'checked' : ''}
             ${count === 0 ? 'disabled' : ''} value="${name}"
             />
            <label class="trip-filters__filter-label" for="filter-${name}">
              ${capitalizeFirstLetter(name)}
            </label>
           </div>`
  );
};

const createTripFiltersElement = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentOption = currentFilterType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersElement(this._filters, this._currentOption);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener('change', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.typeChange(evt.target.value);
  }
}
