import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogService, MachineInformation } from "../app/dialog.service";

@Component({
    selector: 'machine-info',
    imports: [CommonModule],
    templateUrl: './machine-info.component.html',
    styleUrls: ['./machine-info.component.css']
})
export class MachineInfoComponent {
   constructor(
        public dialogService: DialogService,
        public cd: ChangeDetectorRef
    ) {

  }

}
