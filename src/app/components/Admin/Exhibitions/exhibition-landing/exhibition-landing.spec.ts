import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitionLanding } from './exhibition-landing';

describe('ExhibitionLanding', () => {
  let component: ExhibitionLanding;
  let fixture: ComponentFixture<ExhibitionLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitionLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhibitionLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
