import FilterView from '../view/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {tripEventsFilter} from '../filter.js';
import {FilterType, UpdateType} from '../utils/constants.js';

export default class Filter {

  constructor(container, filterModel, tripEvents) {
    this._container = container;
    this._filterModel = filterModel;
    this._tripEventsModel = tripEvents;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilters() {
    const tripEvents = this._tripEventsModel.getTripEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: tripEventsFilter[FilterType.EVERYTHING](tripEvents).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: tripEventsFilter[FilterType.PAST](tripEvents).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: tripEventsFilter[FilterType.FUTURE](tripEvents).length,
      },
    ];
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disable() {
    this._filterComponent
      .getElement()
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((item) => {
        item.setAttribute('disabled', 'disabled');
      });
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

}
