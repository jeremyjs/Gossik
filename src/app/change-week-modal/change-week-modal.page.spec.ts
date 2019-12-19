import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeWeekModalPage } from './change-week-modal.page';

describe('ChangeWeekModalPage', () => {
  let component: ChangeWeekModalPage;
  let fixture: ComponentFixture<ChangeWeekModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWeekModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeWeekModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
