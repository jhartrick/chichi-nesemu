import { Component, Inject } from '@angular/core';
import { Wishbone } from '../../chichi/wishbone/wishbone';
import { WISHBONE_INST } from '../app.module';

@Component({
  selector: 'app-instruction-history',
  imports: [],
  templateUrl: './instruction-history.component.html',
  styleUrl: './instruction-history.component.css'
})
export class InstructionHistoryComponent {
  data: { InstructionHistory: any[]; InstructionHistoryPointer: number; };

  constructor(@Inject(WISHBONE_INST) public wb: Wishbone) {
    this.update(wb);
  }

  private update(wb: Wishbone) {
    const { InstructionHistory, InstructionHistoryPointer } = wb.chichi.Cpu;
    this.data = { InstructionHistory, InstructionHistoryPointer };
  }
}
