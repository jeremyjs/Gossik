import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialProjectsModalPage } from './tutorial-projects-modal.page';

describe('TutorialProjectsModalPage', () => {
  let component: TutorialProjectsModalPage;
  let fixture: ComponentFixture<TutorialProjectsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialProjectsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialProjectsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
