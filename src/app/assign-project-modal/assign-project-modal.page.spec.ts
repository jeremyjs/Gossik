import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignProjectModalPage } from './assign-project-modal.page';

describe('AssignProjectModalPage', () => {
  let component: AssignProjectModalPage;
  let fixture: ComponentFixture<AssignProjectModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignProjectModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignProjectModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
