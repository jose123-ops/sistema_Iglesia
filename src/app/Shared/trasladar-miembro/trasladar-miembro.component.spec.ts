import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrasladarMiembroComponent } from './trasladar-miembro.component';

describe('TrasladarMiembroComponent', () => {
  let component: TrasladarMiembroComponent;
  let fixture: ComponentFixture<TrasladarMiembroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasladarMiembroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrasladarMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
