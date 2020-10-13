import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddPage } from './popover-add.page';

describe('PopoverAddPage', () => {
  let component: PopoverAddPage;
  let fixture: ComponentFixture<PopoverAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
