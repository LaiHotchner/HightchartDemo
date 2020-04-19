import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-realtime-checkin',
  templateUrl: './realtime-checkin.component.html',
  styleUrls: ['./realtime-checkin.component.css']
})
export class RealtimeCheckinComponent implements OnInit {

  interval: any;
  refreshInterval = 3000;
  chart: Highcharts.Chart;
  Highcharts = Highcharts;
  chartOptions = {
    chart: {
      events: {
        load: this.load.bind(this)
      }
    },
    legend: {
      enabled: false
    },
    title: {
      text: '杭州东站实时进站人数'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 200,
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d'
      }
    },
    yAxis: {
      title: {
        text: '实时进站人数'
      }
    },
    tooltip: {
      dateTimeLabelFormats: {
        millisecond: "%A, %b %e, %H:%M:%S",
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%Y-%m-%d'
      }
    },
    series:
      [{
        name: '东出口实时数据',
        data: []
      },
      {
        name: '西出口实时数据',
        data: []
      },
      {
        name: '南出口实时数据',
        data: []
      },
      {
        name: '北出口实时数据',
        data: []
      },
      {
        name: '总进站人数实时数据',
        data: []
      }]
  };

  constructor() {
  }

  ngOnInit() {
  }

  private load(e: Event) {
    var self = this;
    self.chart = e.target as unknown as Highcharts.Chart;
    var data = self.getData(10, self.refreshInterval);
    self.chart.series[0].setData(data[0], false, false);
    self.chart.series[1].setData(data[1], false, false);
    self.chart.series[2].setData(data[2], false, false);
    self.chart.series[3].setData(data[3], false, false);
    self.chart.series[4].setData(data[4], false, false);
    self.chart.redraw();

    self.interval = setInterval(self.updateData.bind(self), self.refreshInterval);
  }

  private getData(n: number, interval: number) {
    var reuslt = [];
    var seriesTotal = [];
    var seriesEast = [];
    var seriesWest = [];
    var seriesSouth = [];
    var seriesNorth = [];

    var startTime = (new Date()).getTime();
    for (var i = n; i >= 0; i--) {
      var xTime = startTime - i * interval;
      var east = Math.floor(100 * Math.random());
      seriesEast.push([xTime, east]);
      var west = Math.floor(100 * Math.random());
      seriesWest.push([xTime, west]);
      var south = Math.floor(100 * Math.random());
      seriesSouth.push([xTime, south]);
      var north = Math.floor(100 * Math.random());
      seriesNorth.push([xTime, north]);
      var total = east + west + south + north;
      seriesTotal.push([xTime, total]);
    }
    reuslt.push(seriesEast);
    reuslt.push(seriesWest);
    reuslt.push(seriesSouth);
    reuslt.push(seriesNorth);
    reuslt.push(seriesTotal);
    return reuslt;
  }

  private updateData() {
    clearInterval(this.interval);
    var startTime = (new Date()).getTime();
    var east = Math.floor(100 * Math.random());
    var west = Math.floor(100 * Math.random());
    var south = Math.floor(100 * Math.random());
    var north = Math.floor(100 * Math.random());
    var total = east + west + south + north;
    this.chart.series[0].addPoint([startTime, east], false, true);
    this.chart.series[1].addPoint([startTime, west], false, true);
    this.chart.series[2].addPoint([startTime, south], false, true);
    this.chart.series[3].addPoint([startTime, north], false, true);
    this.chart.series[4].addPoint([startTime, total], false, true);
    this.chart.redraw();
    this.interval = setInterval(this.updateData.bind(this), this.refreshInterval);
  }
}
