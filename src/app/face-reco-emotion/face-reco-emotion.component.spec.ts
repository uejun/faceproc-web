import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecoEmotionComponent } from './face-reco-emotion.component';

describe('FaceRecoEmotionComponent', () => {
  let component: FaceRecoEmotionComponent;
  let fixture: ComponentFixture<FaceRecoEmotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceRecoEmotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceRecoEmotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
