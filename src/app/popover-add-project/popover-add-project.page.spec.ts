import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverAddProjectPage } from './popover-add-project.page';

describe('PopoverAddProjectPage', () => {
  let component: PopoverAddProjectPage;
  let fixture: ComponentFixture<PopoverAddProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverAddProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverAddProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
