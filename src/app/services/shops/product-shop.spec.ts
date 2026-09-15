import { TestBed } from '@angular/core/testing';

import { ProductShop } from './product-shop';

describe('ProductShop', () => {
  let service: ProductShop;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductShop);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
