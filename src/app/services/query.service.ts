import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  mockCheckinData = [];
  mockLeaveData = [];

  constructor() {
    for (var i = 0; i < 86400; i++) {
      // // 早上5点之前
      // if (i < 5 * 3600) {
      //   this.mockCheckinData[i] = this.getRandom(3, 0);
      //   this.mockLeaveData[i] = this.getRandom(2, 0);
      // }
      // else if (i <= 8 * 3600) {
      //   this.mockCheckinData[i] = this.getRandom(15, 5);
      //   this.mockLeaveData[i] = this.getRandom(10, 0);
      // }
      // else if (i <= 12 * 3600) {
      //   this.mockCheckinData[i] = this.getRandom(50, 10) ;
      //   this.mockLeaveData[i] = this.getRandom(10, 0);
      // }
      // else if (i <= 8 * 3600) {


      // }


      this.mockCheckinData[i] = this.getRandom(20, 0);
      this.mockLeaveData[i] = this.getRandom(10, 0);
      // if (i % 1000 == 0) { console.log(this.mockCheckinData[i]); }


    }
  }

  getCheckinStatisticInfo(interval: number, currentTime: number) {
    interval = interval / 1000;
    var result = [];
    var stopIndex = Math.floor((currentTime - this.getStartTime()) / 1000);

    var sum = 0;
    var index = 0;
    for (var i = 0; i < 86400; i++) {
      if (i >= stopIndex) {
        break;
      }

      if (i > 0 && i % interval == 0) {
        result[index] = sum;
        index++;
      }
      sum += this.mockCheckinData[i];
    }
    return result;
  }

  getStayStatisticInfo(interval: number, currentTime: number) {
    interval = interval / 1000;
    var result = [];
    var stopIndex = Math.floor((currentTime - this.getStartTime()) / 1000);

    var index = 0;
    var sum = 0;
    for (var i = 0; i < 86400; i++) {
      if (i >= stopIndex) {
        break;
      }

      if (i > 0 && i % interval == 0) {
        result[index] = sum;
        index++;
      }
      sum += this.mockCheckinData[i];
      sum -= this.mockLeaveData[i];
    }
    return result;
  }

  getStartTime() {
    return new Date(new Date().toLocaleDateString()).getTime();
  }

  getRandom(iMax: number, iMin: number) {
    return Math.floor(Math.random() * (iMax - iMin) + iMin);
  }
}
