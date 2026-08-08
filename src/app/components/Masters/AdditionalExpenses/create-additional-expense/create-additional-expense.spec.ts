import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdditionalExpense } from './create-additional-expense';

describe('CreateAdditionalExpense', () => {
  let component: CreateAdditionalExpense;
  let fixture: ComponentFixture<CreateAdditionalExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdditionalExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAdditionalExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
