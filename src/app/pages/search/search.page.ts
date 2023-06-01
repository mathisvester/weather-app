import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { City } from 'src/app/models/city.dto';
import { CityAndWeather } from 'src/app/models/cityAndWeather.dto';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { Statuses } from 'src/app/shared/statuses.enum';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  storedCities: City[] = [];
  citiesAndWeatherFound: CityAndWeather[] = [];
  status: Statuses = Statuses.Done;
  statuses = Statuses;
  private searchbar: any;

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit() {
    this.loadStoredCities();
  }

  ionViewDidEnter() {
    this.searchbar = document.querySelector('ion-searchbar');
    if (this.searchbar) {
      fromEvent(this.searchbar, 'ionChange')
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.searchCities();
        });

      fromEvent(this.searchbar, 'ionClear').subscribe(() => {
        this.citiesAndWeatherFound = [];
        this.status = Statuses.Done;
      });
    }
  }

  searchCities() {
    if (this.searchbar.value !== '') {
      this.status = Statuses.Loading;
      this.geolocationService.getCities(this.searchbar.value).subscribe(cities => {
        this.loadCitiesWeather(cities);
      });
    } else {
      this.citiesAndWeatherFound = [];
    }
  }


  private loadCitiesWeather(cities: City[]) {
    cities.forEach(city => {
      this.weatherService.getCurrentWeather(city.lat, city.lon).subscribe(weather => {
        this.citiesAndWeatherFound.push({ city, weather });
        this.status = Statuses.Done;
      });
    });
  }

  private loadStoredCities() {
    this.storedCities = this.geolocationService.getStoredCities();
  }

}
