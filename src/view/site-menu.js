import AbstractView from './abstract.js';
import {MenuItem} from '../utils/constants.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" id="${MenuItem.TABLE}" href="#">Table</a>
            <a class="trip-tabs__btn" id="${MenuItem.STATS}" href="#">Stats</a>
          </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.id);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item !== null) {
      item.classList.toggle('trip-tabs__btn--active');
    }
  }
}

