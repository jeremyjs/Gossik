import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarEventModalPage } from './calendar-event-modal.page';

describe('CalendarEventModalPage', () => {
  let component: CalendarEventModalPage;
  let fixture: ComponentFixture<CalendarEventModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarEventModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarEventModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
