import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoguearPage } from './loguear.page';

describe('LoguearPage', () => {
  let component: LoguearPage;
  let fixture: ComponentFixture<LoguearPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoguearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
