import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SeriesOptionsType, Options } from 'highcharts';

@Component({
  selector: 'app-accumulation-checkin',
  templateUrl: './accumulation-checkin.component.html',
  styleUrls: ['./accumulation-checkin.component.css']
})
export class AccumulationCheckinComponent implements OnInit {

  index = 0;              // Mock数据索引
  currentTime: Date;      // 页面显示用
  accumulativeCheckin = 0; // 当前累计checkin人数


  timer: any;             // 数据刷新计时器，因为需要动态修改计时器间隔时间
  pointInterval = 1000;   // 数据点的初始时间间隔，1000毫秒
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
      text: '杭州东站进站总人数/当前候车室人数'
    },
    xAxis: {
      type: 'datetime',
      tickLength: 10,
      tickWidth: 1,
      tickPixelInterval: 100,
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%Y-%m-%d'
      }
    },
    yAxis: {
      title: {
        text: '人数'
      }
    },
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
        data: []
      }]
  };

  ngOnInit() {
  }

  private load(e: Event) {
    this.chart = e.target as unknown as Highcharts.Chart;

    this.refreshPointInterval();
    this.initChart();

    this.timer = setInterval(this.updateData.bind(this), 1000);
  }

  private initChart() {
    var seriesCheckin = [];
    var seriesStay = [];

    var current = this.getCurrentTime();
    var startTime = this.getStartTime();

    var pointCount = Math.floor((current - startTime) / this.pointInterval);

    this.accumulativeCheckin = 0;
    for (var i = 0; i < pointCount; i++) {
      var checkin = Math.random() * 10 + 5;
      this.accumulativeCheckin += checkin;
      seriesCheckin.push(this.accumulativeCheckin);

      var stay = Math.random() * 100 + 5;
      seriesStay.push(stay);
    }

    this.chart.series[0].setData(seriesCheckin, false, false);
    this.chart.series[1].setData(seriesStay, false, false);
    this.chart.redraw();
  }

  private refreshPointInterval() {
    var current = this.getCurrentTime();
    var startTime = this.getStartTime();

    var interval = (current - startTime) / 1000;

    for (var val of this.pointIntervalDict) {
      if (interval >= val.min && interval < val.max) {
        this.pointInterval = val.value;
        console.log("interval:" + interval);
        console.log(this.pointInterval);
        break;
      }
    }

    var newChartOption = {
      pointStart: this.getStartTime(),
      pointInterval: this.pointInterval
    } as SeriesOptionsType;

    this.chart.series[0].update(newChartOption);
    this.chart.series[1].update(newChartOption);
  }

  private getStartTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  }

  private getCurrentTime() {
    var startTime = this.getStartTime();
    var resultTime = new Date();
    if (this.index % 5 == 0) {
      var multiple = Math.pow(2, Math.floor(this.index / 5));
      resultTime.setTime(startTime + multiple * 60 * 1000);
    }
    this.currentTime = resultTime;
    return resultTime.getTime();
  }

  private updateData() {
    clearInterval(this.timer);

    var checkin = Math.floor(10 * Math.random());
    this.accumulativeCheckin += checkin;
    this.chart.series[0].addPoint(this.accumulativeCheckin, false, false);

    var stay = Math.floor(100 * Math.random());
    this.chart.series[1].addPoint(stay, false, false);

    this.chart.redraw();

    this.index++;
    this.recheckIndex();

    this.timer = setInterval(this.updateData.bind(this), this.pointInterval);
  }

  private recheckIndex() {
    if (this.index % 5 == 0) {
      this.refreshPointInterval();
      this.initChart();
    }
  }





}