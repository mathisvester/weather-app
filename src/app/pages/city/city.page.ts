import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { City } from 'src/app/models/city.dto';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { WeatherService } from 'src/app/services/weather/weather.service';
import {
  catchError,
  combineLatest,
  filter,
  ignoreElements,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-city',
  templateUrl: './city.page.html',
  styleUrls: ['./city.page.scss'],
})
export class CityPage {
  addCity$: Subject<City> = new Subject<City>();
  removeCity$: Subject<City> = new Subject<City>();

  addSuccessful$: Observable<boolean> = this.addCity$.pipe(
    tap((city) => {
      this.geolocationService.addCity(city);
    }),
    map(() => true),
    shareReplay({refCount: true, bufferSize: 1}),
    startWith(false)
  );

  removeSuccessful$: Observable<boolean> = this.removeCity$.pipe(
    tap((city) => {
      this.geolocationService.removeCity(city);
      this.weatherService.removeCityWeather(city.lat, city.lon);
      this.weatherService.removeCityForecast(city.lat, city.lon);
    }),
    map(() => true),
    shareReplay({refCount: true, bufferSize: 1}),
    startWith(false)
  );

  city$: Observable<City | undefined> = this.route.paramMap.pipe(
    filter((params: ParamMap) => params.has('lat') && params.has('lon')),
    map((params: ParamMap) => ({
      lat: Number.parseFloat(params.get('lat') ?? ''),
      lon: Number.parseFloat(params.get('lon') ?? '')
    })),
    switchMap(({lat, lon}) => this.geolocationService.getCity(lat, lon).pipe(
      map(cities => cities[0]),
    )),
    shareReplay({refCount: true, bufferSize: 1})
  );

  isCityStored$: Observable<boolean> = combineLatest([this.city$, this.addSuccessful$, this.removeSuccessful$]).pipe(
    filter(([city]) => !!city),
    map(([city]) => this.geolocationService.isCityStored(city as City)),
    shareReplay({refCount: true, bufferSize: 1})
  );

  error$: Observable<boolean> = this.city$.pipe(
    ignoreElements(),
    catchError(err => of(err))
  );

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private weatherService: WeatherService,
    private geolocationService: GeolocationService,
  ) {
  }

  goBack() {
    this.location.back();
  }
}
