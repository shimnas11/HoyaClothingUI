import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagedProducts } from './damaged-products';

describe('DamagedProducts', () => {
  let component: DamagedProducts;
  let fixture: ComponentFixture<DamagedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamagedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamagedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
