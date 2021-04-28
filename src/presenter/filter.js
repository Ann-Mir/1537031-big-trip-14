import FilterView from '../view/filter.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {tripEventsFilter} from '../filter.js';
import {FilterType, UpdateType} from '../utils/constants.js';

export default class Filter {
  constructor(filterContainer, filterModel, tripEvents) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._tripEventsModel = tripEvents;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._tripEventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
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
}
