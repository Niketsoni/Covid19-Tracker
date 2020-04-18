import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/modals/global-data';
import { DateWiseData } from 'src/app/modals/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styles: [],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart',
  };
  currentCountry = '';

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((res) => {
            this.countries.push(res.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateTrackerCard('India');
      },
    });
  }

  updateChart() {
    const dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach((res) => {
      dataTable.push([res.date, res.case]);
    });

    this.lineChart = {
      chartType: 'LineChart',
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

  updateTrackerCard(country: string) {
    console.log(country);
    this.data.forEach((res) => {
      if (res.country === country) {
        this.currentCountry = res.country;
        this.totalConfirmed = res.confirmed;
        this.totalActive = res.active;
        this.totalDeaths = res.deaths;
        this.totalRecovered = res.recovered;
      }
      this.selectedCountryData = this.dateWiseData[country];
      // console.log(this.selectedCountryData);
      this.updateChart();
    });
  }
}
