import AbstractView from './abstract.js';

const createEventsListTemplate = () => {
  return `<ul class="trip-events__list">
          </ul>`;
};

export default class EventsList extends AbstractView {
  getTemplate() {
    return createEventsListTemplate();
  }
}
