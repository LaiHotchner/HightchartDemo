import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-accumulation-checkin',
  templateUrl: './accumulation-checkin.component.html',
  styleUrls: ['./accumulation-checkin.component.css']
})
export class AccumulationCheckinComponent implements OnInit {

  interval: any;
  index = 1;              // 当前执行次数
  upgradeInterval = 10;   // 每10次增加范围
  refreshInterval = 1000; // 刷新时间间隔
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
      enabled: true,
      type: 'datetime',
      tickLength: 10,
      tickWidth: 1,
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d'
      }
    },
    yAxis: {
      title: {
        text: '累计进站人数'
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
  constructor() { }

  ngOnInit() {
  }

  private load(e: Event) {
    this.chart = e.target as unknown as Highcharts.Chart;
    this.initData(1);

    this.interval = setInterval(this.updateData.bind(this), this.refreshInterval);
  }

  private initData(scale: number) {
    this.chart.series[0].setData([]);
    this.chart.series[1].setData([]);

    var data = this.getData(5, scale);
    this.chart.series[0].setData(data[0], false, false);
    this.chart.series[1].setData(data[1], false, false);
    this.chart.redraw();
  }

  private getData(n: number, scale: number) {
    var reuslt = [];
    var seriesEast = [];
    var seriesWest = [];

    var startTime = (new Date()).getTime();
    for (var i = n; i > 0; i--) {
      var xTime = startTime - i * this.refreshInterval * scale;
      var east = Math.floor(100 * scale * Math.random());
      seriesEast.push([xTime, east]);
      var west = Math.floor(100 * scale * Math.random());
      seriesWest.push([xTime, west]);
    }
    reuslt.push(seriesEast);
    reuslt.push(seriesWest);
    return reuslt;
  }

  private updateData() {
    clearInterval(this.interval);
    var y = Math.floor(this.index / this.upgradeInterval);
    var scale = Math.pow(10, y)
    if (this.index % this.upgradeInterval == 0) {
      this.initData(scale);
      var scaleInterval = Math.pow(2, y)
      this.refreshInterval = this.refreshInterval * scaleInterval;
    }

    var startTime = (new Date()).getTime();
    var xTime = startTime + this.index * this.refreshInterval;


    var east = Math.floor(100 * scale * Math.random());
    var west = Math.floor(100 * scale * Math.random());
    this.chart.series[0].addPoint([xTime, east], false, false);
    this.chart.series[1].addPoint([xTime, west], false, false);

    this.index++;
    this.chart.redraw();
    this.interval = setInterval(this.updateData.bind(this), this.refreshInterval);
  }
}
