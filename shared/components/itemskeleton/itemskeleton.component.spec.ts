import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemskeletonComponent } from './itemskeleton.component';

describe('ItemskeletonComponent', () => {
  let component: ItemskeletonComponent;
  let fixture: ComponentFixture<ItemskeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemskeletonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemskeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
