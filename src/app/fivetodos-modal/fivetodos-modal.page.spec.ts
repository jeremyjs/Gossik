import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FivetodosModalPage } from './fivetodos-modal.page';

describe('FivetodosModalPage', () => {
  let component: FivetodosModalPage;
  let fixture: ComponentFixture<FivetodosModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FivetodosModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FivetodosModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
