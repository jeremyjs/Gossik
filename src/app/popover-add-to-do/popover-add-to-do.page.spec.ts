import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddToDoPage } from './popover-add-to-do.page';

describe('PopoverAddToDoPage', () => {
  let component: PopoverAddToDoPage;
  let fixture: ComponentFixture<PopoverAddToDoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddToDoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddToDoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
