import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionHistoryComponent } from './instruction-history.component';

describe('InstructionHistoryComponent', () => {
  let component: InstructionHistoryComponent;
  let fixture: ComponentFixture<InstructionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
