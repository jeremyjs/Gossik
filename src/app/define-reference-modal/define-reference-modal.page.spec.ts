import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefineReferenceModalPage } from './define-reference-modal.page';

describe('DefineReferenceModalPage', () => {
  let component: DefineReferenceModalPage;
  let fixture: ComponentFixture<DefineReferenceModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineReferenceModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefineReferenceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
