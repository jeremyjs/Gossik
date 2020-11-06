import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverFinishToDoPage } from './popover-finish-to-do.page';

describe('PopoverFinishToDoPage', () => {
  let component: PopoverFinishToDoPage;
  let fixture: ComponentFixture<PopoverFinishToDoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFinishToDoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverFinishToDoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
