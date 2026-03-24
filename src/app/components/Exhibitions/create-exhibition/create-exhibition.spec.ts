import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExhibition } from './create-exhibition';

describe('CreateExhibition', () => {
  let component: CreateExhibition;
  let fixture: ComponentFixture<CreateExhibition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExhibition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExhibition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
