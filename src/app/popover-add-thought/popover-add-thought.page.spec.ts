import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddThoughtPage } from './popover-add-thought.page';

describe('PopoverAddThoughtPage', () => {
  let component: PopoverAddThoughtPage;
  let fixture: ComponentFixture<PopoverAddThoughtPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddThoughtPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddThoughtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
