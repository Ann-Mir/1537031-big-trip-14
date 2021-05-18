import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {getDuration, humanizeDuration} from '../utils/trip-event.js';
import {StatiscticsTitles, STATISTICS_SETTINGS} from '../utils/constants.js';
import {sortMapByValues} from '../utils/statistics.js';


const renderMoneyChart = (moneyCtx, tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let spendingsByType = eventsByType.get(tripEvent.type);
      spendingsByType = spendingsByType + tripEvent.basePrice;
      eventsByType.set(tripEvent.type, spendingsByType);
    } else {
      eventsByType.set(tripEvent.type, tripEvent.basePrice);
    }
  });

  const sortedEvents = sortMapByValues(eventsByType);

  moneyCtx.height = sortedEvents.size * STATISTICS_SETTINGS.barHeight;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: [...sortedEvents.keys()],
      datasets: [{
        data: [...sortedEvents.values()],
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.MONEY,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
            callback: (val) => `${val.toUpperCase()}`,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: STATISTICS_SETTINGS.barThickness,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: STATISTICS_SETTINGS.minBarLength,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderChartByTripType = (typeCtx, tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let countByType = eventsByType.get(tripEvent.type);
      countByType = countByType + 1;
      eventsByType.set(tripEvent.type, countByType);
    } else {
      eventsByType.set(tripEvent.type, 1);
    }
  });

  const sortedEvents = sortMapByValues(eventsByType);

  typeCtx.height = sortedEvents.size * STATISTICS_SETTINGS.barHeight;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: [...sortedEvents.keys()],
      datasets: [{
        data: [...sortedEvents.values()],
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.TYPE,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
            callback: (val) => `${val.toUpperCase()}`,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: STATISTICS_SETTINGS.barThickness,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: STATISTICS_SETTINGS.minBarLength,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (timeCtx, tripEvents) => {
  const eventsByType = new Map();
  tripEvents.forEach((tripEvent) => {
    if (eventsByType.has(tripEvent.type)) {
      let duration = eventsByType.get(tripEvent.type);
      duration = duration + getDuration(tripEvent.dateFrom, tripEvent.dateTo);
      eventsByType.set(tripEvent.type, duration);
    } else {
      eventsByType.set(tripEvent.type, getDuration(tripEvent.dateFrom, tripEvent.dateTo));
    }
  });

  const sortedEvents = sortMapByValues(eventsByType);

  timeCtx.height = sortedEvents.size * STATISTICS_SETTINGS.barHeight;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: [...sortedEvents.keys()],
      datasets: [{
        data: [...sortedEvents.values()],
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: STATISTICS_SETTINGS.basicFontSize,
          },
          color: STATISTICS_SETTINGS.datalabelsColor,
          anchor: STATISTICS_SETTINGS.datalabelsAnchor,
          align: STATISTICS_SETTINGS.datalabelsAlign,
          formatter: (val) => `${humanizeDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: StatiscticsTitles.TIME_SPENT,
        fontColor: STATISTICS_SETTINGS.fontColor,
        fontSize: STATISTICS_SETTINGS.titleFontSize,
        position: STATISTICS_SETTINGS.titlePosition,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: STATISTICS_SETTINGS.fontColor,
            padding: STATISTICS_SETTINGS.padding,
            fontSize: STATISTICS_SETTINGS.basicFontSize,
            callback: (val) => `${val.toUpperCase()}`,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: STATISTICS_SETTINGS.barThickness,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: STATISTICS_SETTINGS.minBarLength,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
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
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');


    this._timeChart = renderTimeChart(timeCtx, this._tripEvents);
    this._moneyChart = renderMoneyChart(moneyCtx, this._tripEvents);
    this._typeChart = renderChartByTripType(typeCtx, this._tripEvents);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }
}
