import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperatorPad } from './operator-pad';

describe('OperatorPad', () => {
  let component: OperatorPad;
  let fixture: ComponentFixture<OperatorPad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorPad],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorPad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
