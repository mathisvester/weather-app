import { Component, Input, OnInit } from '@angular/core';
import { Weather } from 'src/app/models/weather.dto';
import { TemperatureScaleService } from 'src/app/services/temperature-scale/temperature-scale.service';
import { Scales } from 'src/app/shared/utils/scales.enum';

@Component({
  selector: 'app-daily-forecast-card',
  templateUrl: './daily-forecast-card.component.html',
  styleUrls: ['./daily-forecast-card.component.scss']
})
export class DailyForecastCardComponent implements OnInit {

  activeScale: Scales = Scales.Fahrenheit;
  @Input() weather: Weather | undefined;

  constructor(
    private temperatureScaleService: TemperatureScaleService
  ) { }

  ngOnInit(): void {
    this.temperatureScaleService.activeScale.subscribe(scale => {
      this.activeScale = scale;
    });
  }

}
