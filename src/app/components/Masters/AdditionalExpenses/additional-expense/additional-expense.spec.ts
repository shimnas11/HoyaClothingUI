import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalExpense } from './additional-expense';

describe('AdditionalExpense', () => {
  let component: AdditionalExpense;
  let fixture: ComponentFixture<AdditionalExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
