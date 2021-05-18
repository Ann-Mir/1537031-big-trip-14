import Observer from '../utils/observer.js';
import {FilterType} from '../utils/constants.js';

export default class Filter extends Observer {

  constructor() {
    super();
    this._activeOption = FilterType.EVERYTHING;
  }

  getFilter() {
    return this._activeOption;
  }

  setFilter(updateType, filter) {
    this._activeOption = filter;
    this._notify(updateType, filter);
  }

}
