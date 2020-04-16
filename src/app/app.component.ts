import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    var option = {
      global: {
        useUTC: false
      }
    } as Options;
    Highcharts.setOptions(option);
  }
}
