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

  index = 0;                  // Mock数据索引
  currentTime = new Date();   // 当前时间,页面显示用

  pointInterval = 1000;       // 数据点的初始时间间隔，1000毫秒
  pointIntervalDict = [
    {
      // 0~60秒：每秒更新一次
      min: 0,
      max: 60,
      value: 1000,
      mockDate: new Date(2020, 3, 17, 0, 0, 30)
    },
    {
      // 1min~5min：每3秒更新一次
      min: 60,
      max: 300,
      value: 3000,
      mockDate: new Date(2020, 3, 17, 0, 3, 0)
    },
    {
      // 5min~30min：每10秒更新一次
      min: 300,
      max: 1800,
      value: 10000,
      mockDate: new Date(2020, 3, 17, 0, 15, 0)
    },
    {
      // 30min~1hour：每30秒更新一次
      min: 1800,
      max: 3600,
      value: 30000,
      mockDate: new Date(2020, 3, 17, 0, 45, 0)
    },
    {
      // 1hour~2hour：每1分钟更新一次
      min: 3600,
      max: 7200,
      value: 60000,
      mockDate: new Date(2020, 3, 17, 1, 15, 0)
    },
    {
      // 2hour~6hour：每3分钟更新一次
      min: 7200,
      max: 21600,
      value: 180000,
      mockDate: new Date(2020, 3, 17, 3, 30, 0)
    },
    {
      // 6hour~12hour：每5分钟更新一次
      min: 21600,
      max: 43200,
      value: 300000,
      mockDate: new Date(2020, 3, 17, 12, 15, 0)
    },
    {
      // 12hour以上：每10分钟更新一次
      min: 43200,
      max: 86400,
      value: 600000,
      mockDate: new Date(2020, 3, 17, 16, 45, 0)
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
        data: [],
        pointInterval: 1000
      },
      {
        name: '当前候车室人数',
        yAxis: 1,
        data: [],
        pointInterval: 1000
      }]
  };

  constructor(private queryService: QueryService) {
  }

  ngOnInit() {
    this.currentTime = this.pointIntervalDict[0].mockDate;
  }

  private load(e: Event) {
    this.chart = e.target as unknown as Highcharts.Chart;

    this.refreshInterval();
    this.initData();
  }
  private refreshInterval() {
    var lastInterval = this.pointInterval;
    var current = this.getCurrentTime();
    var startTime = this.getStartTime();

    var interval = (current - startTime) / 1000;
    for (var val of this.pointIntervalDict) {
      if (interval >= val.min && interval < val.max) {
        this.pointInterval = val.value;
        break;
      }
    }
    // 间隔无变化则不刷新
    if (lastInterval == this.pointInterval) {
      return false;
    }
    var newChartOption = {
      pointStart: startTime,
      pointInterval: this.pointInterval
    } as SeriesOptionsType;

    this.chart.series[0].update(newChartOption);
    this.chart.series[1].update(newChartOption);
    return true;
  }
  private initData() {
    var current = this.getCurrentTime();
    var seriesCheckin = this.queryService.getCheckinStatisticInfo(this.pointInterval, current);
    var seriesStay = this.queryService.getStayStatisticInfo(this.pointInterval, current);

    var strDate = new Date(current).toLocaleTimeString();
    console.log(strDate + ": 累计进站数据量：" + seriesCheckin.length);

    this.chart.series[0].setData(seriesCheckin, false, false);
    this.chart.series[1].setData(seriesStay, false, false);
    this.chart.redraw();

    setTimeout(() => { this.updateData(); }, this.pointInterval);
  }
  private updateData() {
    this.currentTime = new Date((this.currentTime.getTime() + this.pointInterval));
    // 如果时间间隔发生变化，则需要重新加载所有数据
    if (this.refreshInterval()) {
      this.initData();
      return;
    }

    var current = this.getCurrentTime();
    var seriesCheckin = this.queryService.getCheckinStatisticInfo(this.pointInterval, current);
    var seriesStay = this.queryService.getStayStatisticInfo(this.pointInterval, current);

    // 初始化时已经添加了之前的数据，因此此时只要添加最后一个数据即可
    this.chart.series[0].addPoint(seriesCheckin[seriesCheckin.length - 1], false, false);
    this.chart.series[1].addPoint(seriesStay[seriesStay.length - 1], false, false);

    this.chart.redraw();

    setTimeout(() => { this.updateData(); }, this.pointInterval);
  }
  private getStartTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  }
  private getCurrentTime() {
    return this.currentTime.getTime();
    // return new Date().getTime();
  }



  // private recheckIndex() {
  //   this.index++;
  //   var resultTime = new Date();
  //   if (this.index % 5 == 0) {
  //     var mockDataIndex = Math.floor(this.index / 5);
  //     if (mockDataIndex >= this.pointIntervalDict.length) {
  //       resultTime = new Date();
  //     }
  //     else {
  //       var mockStartTime = this.pointIntervalDict[mockDataIndex].mockDate;
  //       resultTime = new Date(mockStartTime.getTime() + this.index * 1000);
  //     }
  //   }
  //   this.currentTime = resultTime;

  //   if (this.index % 5 == 0) {
  //     this.refreshChartInfo();
  //   }
  // }
}
