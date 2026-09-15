import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundModal } from './refund-modal';

describe('RefundModal', () => {
  let component: RefundModal;
  let fixture: ComponentFixture<RefundModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
