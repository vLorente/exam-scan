import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DemoSectionComponent } from './demo-section';

describe('DemoSectionComponent', () => {
  let component: DemoSectionComponent;
  let fixture: ComponentFixture<DemoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
