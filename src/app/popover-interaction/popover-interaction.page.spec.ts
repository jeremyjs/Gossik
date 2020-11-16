import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverInteractionPage } from './popover-interaction.page';

describe('PopoverInteractionPage', () => {
  let component: PopoverInteractionPage;
  let fixture: ComponentFixture<PopoverInteractionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverInteractionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverInteractionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
