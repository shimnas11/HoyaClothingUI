import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExhibition } from './list-exhibition';

describe('ListExhibition', () => {
  let component: ListExhibition;
  let fixture: ComponentFixture<ListExhibition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExhibition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExhibition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
