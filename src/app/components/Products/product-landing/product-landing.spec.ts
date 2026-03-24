import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLanding } from './product-landing';

describe('ProductLanding', () => {
  let component: ProductLanding;
  let fixture: ComponentFixture<ProductLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
