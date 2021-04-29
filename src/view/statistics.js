import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart.js';

const createStatisticsTemplate = () => {
  //const completedTaskCount = 0; // Нужно посчитать количество завершенных задач за период

  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>

            <div class="statistics__item statistics__item--money">
              <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--transport">
              <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
            </div>

            <div class="statistics__item statistics__item--time-spend">
              <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
            </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(tasks) {
    super();

    this._state = {
      tasks,
      // По условиям техзадания по умолчанию интервал - неделя от текущей даты
      dateFrom: (() => {
        const daysToFullWeek = 6;
        return dayjs().subtract(daysToFullWeek, 'day').toDate();
      })(),
      dateTo: dayjs().toDate(),
    };

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._state);
  }

  restoreHandlers() {
    this._setCharts();
    this._setDatepicker();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateState({
      dateFrom,
      dateTo,
    });
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(
      this.getElement().querySelector('.statistic__period-input'),
      {
        mode: 'range',
        dateFormat: 'j F',
        defaultDate: [this._state.dateFrom, this._state.dateTo],
        onChange: this._dateChangeHandler,
      },
    );
  }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
