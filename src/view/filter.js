import AbstractView from './abstract.js';
import {capitalizeFirstLetter} from '../utils/common';

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

<!--            <div class="trip-filters__filter">-->
<!--              <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">-->
<!--              <label class="trip-filters__filter-label" for="filter-everything">Everything</label>-->
<!--            </div>-->

<!--            <div class="trip-filters__filter">-->
<!--              <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">-->
<!--              <label class="trip-filters__filter-label" for="filter-future">Future</label>-->
<!--            </div>-->

<!--            <div class="trip-filters__filter">-->
<!--              <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" checked>-->
<!--              <label class="trip-filters__filter-label" for="filter-past">Past</label>-->
<!--            </div>-->

            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {

  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersElement(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }

}
