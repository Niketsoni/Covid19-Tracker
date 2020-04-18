import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, count } from 'rxjs/operators';
import { GlobalDataSummary } from '../modals/global-data';
import { DateWiseData } from '../modals/date-wise-data';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  pipe = new DatePipe('en-US');
  todayDate = new Date();
  yesterdaysDate = this.todayDate.setDate(this.todayDate.getDate() - 1); // substracting 1 day from current day
  formatedDate = this.pipe.transform(this.todayDate, 'MM-dd-yyyy');

  private globalDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' +
    this.formatedDate +
    '.csv';
  private dateWiseDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http: HttpClient) {}

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        const rows = result.split('\n'); // adding line break to line items
        const header = rows[0]; // fetching the header from datasheet
        // console.log(rows); // displaying all datasheet

        const mainData = {}; // main data object declared here

        const dates = header.split(/,(?=\S)/); // filltering dates
        dates.splice(0, 4); // removing unnecessary columns
        rows.splice(0, 1); // removing header(ast row) from datasheet
        // console.log(dates); // displaying all dates

        rows.forEach((row) => {
          const cols = row.split(/,(?=\S)/); // getting all the column values by splitting by comma
          const countryName = cols[1]; // getting country name
          cols.splice(0, 4); // removing 0-4 cols from array
          // console.log(countryName, cols);

          mainData[countryName] = []; // empty array for main data
          cols.forEach((value, index) => {
            const dw: DateWiseData = {
              case: +value, // converting string to number
              country: countryName,
              date: new Date(Date.parse(dates[index])),
            };

            mainData[countryName].push(dw); // pusing dw object in mainData object(the final result)
          });
        });

        // console.log('Main Object', mainData);
        return mainData;
      })
    );
  }

  getGlobalData() {
    console.log('globalDataUrl', this.globalDataUrl);
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        const data: GlobalDataSummary[] = [];
        const rows = result.split('\n');
        const raw = {};
        rows.splice(0, 1);

        rows.forEach((row) => {
          const cols = row.split(/,(?=\S)/); // filter a comma seperated value which has space with it

          const cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };

          const temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            (temp.active = cs.active + temp.active),
              (temp.confirmed = cs.confirmed + temp.confirmed),
              (temp.deaths = cs.deaths + temp.deaths),
              (temp.recovered = cs.recovered + temp.recovered),
              (raw[cs.country] = temp);
          } else {
            raw[cs.country] = cs;
          }
        });
        // console.log('country wise data', raw);
        return Object.values(raw) as GlobalDataSummary[];
      })
    );
  }
}
