import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverFilterToDosPage } from './popover-filter-to-dos.page';

describe('PopoverFilterToDosPage', () => {
  let component: PopoverFilterToDosPage;
  let fixture: ComponentFixture<PopoverFilterToDosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFilterToDosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverFilterToDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
