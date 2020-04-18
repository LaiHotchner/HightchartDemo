import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SeriesOptionsType, Options } from 'highcharts';
import { QueryService } from '../services/query.service';

@Component({
  selector: 'app-accumulation-checkin',
  templateUrl: './accumulation-checkin.component.html',
  styleUrls: ['./accumulation-checkin.component.css']
})
export class AccumulationCheckinComponent implements OnInit {
  currentTime = new Date();
  mockStartTime = [
    new Date(2020, 3, 18, 0, 0, 30),
    new Date(2020, 3, 18, 0, 3, 0),
    new Date(2020, 3, 18, 0, 15, 0),
    new Date(2020, 3, 18, 0, 45, 0),
    new Date(2020, 3, 18, 1, 15, 0),
    new Date(2020, 3, 18, 3, 30, 0),
    new Date(2020, 3, 18, 12, 15, 0),
    new Date(2020, 3, 18, 16, 45, 0)
  ];

  addPointTimer: any;
  checkIntervalMs = 1000;

  pointInterval = 0;
  pointIntervalDict = [
    {
      // 0~60秒：每秒更新一次
      min: 0,
      max: 60,
      value: 1000
    },
    {
      // 1min~5min：每3秒更新一次
      min: 60,
      max: 300,
      value: 3000
    },
    {
      // 5min~30min：每10秒更新一次
      min: 300,
      max: 1800,
      value: 10000
    },
    {
      // 30min~1hour：每30秒更新一次
      min: 1800,
      max: 3600,
      value: 30000
    },
    {
      // 1hour~2hour：每1分钟更新一次
      min: 3600,
      max: 7200,
      value: 60000
    },
    {
      // 2hour~6hour：每3分钟更新一次
      min: 7200,
      max: 21600,
      value: 180000
    },
    {
      // 6hour~12hour：每5分钟更新一次
      min: 21600,
      max: 43200,
      value: 300000
    },
    {
      // 12hour以上：每10分钟更新一次
      min: 43200,
      max: 86400,
      value: 600000
    }];

  chart: Highcharts.Chart;
  Highcharts = Highcharts;
  chartOptions = {
    chart: {
      events: {
        load: this.load.bind(this)
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      tickLength: 10,
      tickWidth: 1,
      tickPixelInterval: 200,
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%Y-%m-%d'
      }
    },
    yAxis: [{
      title: {
        text: '累计进站人数'
      }
    },
    {
      title: {
        text: '当前候车室人数'
      },
      opposite: true
    }],
    tooltip: {
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%Y-%m-%d'
      }
    },
    series:
      [{
        name: '当日累计进站人数',
        data: []
      },
      {
        name: '当前候车室人数',
        yAxis: 1,
        data: []
      }]
  };

  constructor(private queryService: QueryService) {
  }

  ngOnInit() {
    // mock 使用，正式代码应该移除
    this.currentTime = this.mockStartTime[0];
  }

  private load(e: Event) {
    this.chart = e.target as unknown as Highcharts.Chart;

    setInterval(this.checkInterval.bind(this), this.checkIntervalMs);
  }

  private checkInterval() {
    // mock 使用，正式代码应该移除这一句
    this.currentTime = new Date((this.getCurrentTime() + this.checkIntervalMs));

    const lastInterval = this.pointInterval;
    const current = this.getCurrentTime();
    const startTime = this.getStartTime();

    const interval = (current - startTime) / 1000;
    for (const val of this.pointIntervalDict) {
      if (interval >= val.min && interval < val.max) {
        this.pointInterval = val.value;
        break;
      }
    }

    console.log("check interval at" + this.currentTime.toLocaleTimeString());

    // 间隔无变化则不刷新
    if (lastInterval === this.pointInterval) {
      return;
    }
    this.initChart(startTime, current);
  }

  private initChart(startTime, current) {
    clearTimeout(this.addPointTimer);
    this.refreshOption(startTime);
    this.redrawSeries(current);
    this.addPointTimer = setInterval(this.addPoint.bind(this), this.pointInterval);
  }

  private refreshOption(startTime) {
    const newChartOption = {
      pointStart: startTime,
      pointInterval: this.pointInterval
    } as SeriesOptionsType;
    this.chart.series[0].update(newChartOption);
    this.chart.series[1].update(newChartOption);
  }

  private redrawSeries(current) {
    const seriesCheckin = this.queryService.getCheckinStatisticInfo(this.pointInterval, current);
    const seriesStay = this.queryService.getStayStatisticInfo(this.pointInterval, current);
    this.chart.series[0].setData(seriesCheckin, false, false);
    this.chart.series[1].setData(seriesStay, false, false);
    this.chart.redraw();
  }

  private addPoint() {
    const current = this.getCurrentTime();
    // 根据新的当前时间获取最新数据
    const seriesCheckin = this.queryService.getCheckinStatisticInfo(this.pointInterval, current);
    const seriesStay = this.queryService.getStayStatisticInfo(this.pointInterval, current);

    // 初始化时已经添加了之前的数据，因此此时只要添加最后一个数据即可
    this.chart.series[0].addPoint(seriesCheckin[seriesCheckin.length - 1], false, false);
    this.chart.series[1].addPoint(seriesStay[seriesStay.length - 1], false, false);

    // 整个图标更新效果不好
    // this.chart.series[0].setData(seriesCheckin, false, false);
    // this.chart.series[1].setData(seriesStay, false, false);

    this.chart.redraw();
  }

  private getStartTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  }

  private getCurrentTime() {
    // 正式代码
    // return new Date().getTime();
    return this.currentTime.getTime();
  }

  updateStartTime(e) {
    this.currentTime = new Date(e.target.value);
  }
}
