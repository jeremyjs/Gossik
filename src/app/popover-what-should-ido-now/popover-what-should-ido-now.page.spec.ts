import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverWhatShouldIDoNowPage } from './popover-what-should-ido-now.page';

describe('PopoverWhatShouldIDoNowPage', () => {
  let component: PopoverWhatShouldIDoNowPage;
  let fixture: ComponentFixture<PopoverWhatShouldIDoNowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverWhatShouldIDoNowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverWhatShouldIDoNowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
