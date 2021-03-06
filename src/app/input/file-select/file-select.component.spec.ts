import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectComponent } from './file-select.component';

describe('FileSelectComponent', () => {
  let component: FileSelectComponent;
  let fixture: ComponentFixture<FileSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
