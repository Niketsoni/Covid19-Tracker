import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tracker-card',
  templateUrl: './tracker-card.component.html',
  styles: [],
})
export class TrackerCardComponent implements OnInit {
  @Input('totalConfirmed') totalConfirmed;
  @Input('totalActive') totalActive;
  @Input('totalDeaths') totalDeaths;
  @Input('totalRecovered') totalRecovered;
  constructor() {}

  ngOnInit(): void {}
}
