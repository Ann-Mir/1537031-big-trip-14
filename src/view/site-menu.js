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
    this._clickHandler = this._clickHandler.bind(this);
  }

  setItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((item) => {
      if (item.getAttribute('id') === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.id);
  }
}
