import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/modals/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];

  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };

  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });
        this.initChart('Confirmed');
      },
    });
  }
  initChart(caseType: string) {
    const dataTable = [];
    dataTable.push(['Country', 'Cases']);
    this.globalData.forEach((cs) => {
      // tslint:disable-next-line: prefer-const
      let caseValue = 0;
      if (caseType === 'Confirmed') {
        if (cs.confirmed > 20000) {
          caseValue = cs.confirmed;
        }
      }
      if (caseType === 'Active') {
        if (cs.active > 2000000) {
          caseValue = cs.active;
        }
      }
      if (caseType === 'Death') {
        if (cs.deaths > 100000) {
          caseValue = cs.deaths;
        }
      }
      if (caseType === 'Recovered') {
        if (cs.recovered > 50000) {
          caseValue = cs.recovered;
        }
      }
      dataTable.push([cs.country, caseValue]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }
}
