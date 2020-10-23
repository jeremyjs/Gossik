import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddCalendarEventPage } from './popover-add-calendar-event.page';

describe('PopoverAddCalendarEventPage', () => {
  let component: PopoverAddCalendarEventPage;
  let fixture: ComponentFixture<PopoverAddCalendarEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddCalendarEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddCalendarEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
