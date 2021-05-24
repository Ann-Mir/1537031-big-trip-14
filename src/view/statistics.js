import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {humanizeDuration} from '../utils/trip-event.js';
import {StatisticsTitles, STATISTICS_SETTINGS} from '../utils/constants.js';
import {
  sortMapByValues,
  mapEventsByType,
  mapSpendingsByType,
  mapDurationByType
} from '../utils/statistics.js';

const formatMoneyValue = (value) => `€ ${value}`;

const formatTypeCount = (value) => `${value}x`;

const formatDuration = (value) => `${humanizeDuration(value)}`;

const formatLabelName = (value) => `${value.toUpperCase()}`;

const renderChart = (canvas, labels, data, dataFormatter, labelsFormatter, chartTitle) => {
  canvas.height = data.length * STATISTICS_SETTINGS.barHeight;

  return new Chart(canvas, {
    plugins: [ChartDataLabels],
    type: STATISTICS_SETTINGS.type,
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: STATISTICS_SETTINGS.backgroundColor,
        hoverBackgroundColor: STATISTICS_SETTINGS.hoverBackgroundColor,
        anchor: STATISTICS_SETTINGS.dataAnchor,
        barThickness: STATISTICS_SETTINGS.barThickness,
        minBarLength: STATISTICS_SETTINGS.minBarLength,
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
          formatter: dataFormatter,
        },
      },
      title: {
        display: true,
        text: chartTitle,
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
            callback: labelsFormatter,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
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

    const sortedSpendingsByType = sortMapByValues(mapSpendingsByType(this._tripEvents));
    const sortedTripTypesCount = sortMapByValues(mapEventsByType(this._tripEvents));
    const sortedDurationByType = sortMapByValues(mapDurationByType(this._tripEvents));

    this._timeChart = renderChart(
      timeCtx,
      [...sortedDurationByType.keys()],
      [...sortedDurationByType.values()],
      formatDuration,
      formatLabelName,
      StatisticsTitles.TIME_SPENT,
    );

    this._moneyChart = renderChart(
      moneyCtx,
      [...sortedSpendingsByType.keys()],
      [...sortedSpendingsByType.values()],
      formatMoneyValue,
      formatLabelName,
      StatisticsTitles.MONEY,
    );

    this._typeChart = renderChart(
      typeCtx,
      [...sortedTripTypesCount.keys()],
      [...sortedTripTypesCount.values()],
      formatTypeCount,
      formatLabelName,
      StatisticsTitles.TYPE,
    );
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
