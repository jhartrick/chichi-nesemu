import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MachineInformation } from "../app/dialog.service";
import { ChiChiCPPU } from "chichines";

@Component({
  selector: 'machine-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './machine-info.component.html',
  styleUrls: ['./machine-info.component.css']
})
export class MachineInfoComponent {
   machine: ChiChiCPPU;
   constructor(
        public dialogRef: MatDialogRef<MachineInfoComponent, MachineInformation>,
        @Inject(MAT_DIALOG_DATA) public data: MachineInformation,
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {
        const { accumulator, indexRegisterX, indexRegisterY, InstructionHistory } = data.machine.chichi.Cpu;
        
        
    }
}
