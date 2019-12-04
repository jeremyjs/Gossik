import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefineActionModalPage } from './define-action-modal.page';

describe('DefineActionModalPage', () => {
  let component: DefineActionModalPage;
  let fixture: ComponentFixture<DefineActionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineActionModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefineActionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
