import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DefineDelegationModalPage } from './define-delegation-modal.page';

describe('DefineDelegationModalPage', () => {
  let component: DefineDelegationModalPage;
  let fixture: ComponentFixture<DefineDelegationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineDelegationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefineDelegationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
