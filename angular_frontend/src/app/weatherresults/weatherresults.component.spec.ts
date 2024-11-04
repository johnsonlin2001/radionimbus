import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherresultsComponent } from './weatherresults.component';

describe('WeatherresultsComponent', () => {
  let component: WeatherresultsComponent;
  let fixture: ComponentFixture<WeatherresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherresultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
