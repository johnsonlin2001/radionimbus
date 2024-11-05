import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempchartComponent } from './tempchart.component';

describe('TempchartComponent', () => {
  let component: TempchartComponent;
  let fixture: ComponentFixture<TempchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
