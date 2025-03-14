import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { DialogService } from "../dialog.service";
import { Wishbone } from "../../chichi/wishbone/wishbone";
import { WISHBONE_INST } from "../app.module";
import { MatButtonModule } from "@angular/material/button";
import { CpuStatus, DebugHelpers } from "chichines";

@Component({
    selector: 'machine-info',
    imports: [CommonModule, MatButtonModule],
    templateUrl: './machine-info.component.html',
    styleUrls: ['./machine-info.component.css']
})
export class MachineInfoComponent {
  public CPUStatus: CpuStatus & { clock: number, currentInstruction: string };
  public debugging: true;
  constructor(
        public dialogService: DialogService,
        public cd: ChangeDetectorRef,
        @Inject(WISHBONE_INST) public wb: Wishbone
    ) {
      this.CPUStatus = {  clock:0, currentInstruction: '', ...this.wb.chichi.Cpu.GetStatus() };

      wb.instructionHistory.subscribe(x => {
        this.CPUStatus = Object.assign(this.CPUStatus, { currentInstruction: DebugHelpers.disassemble(x) });
      })
  }

  step = () => {
    this.wb.step();
  }
  
  stepFrame = () =>{
    this.wb.runframe(); 
  }

}
