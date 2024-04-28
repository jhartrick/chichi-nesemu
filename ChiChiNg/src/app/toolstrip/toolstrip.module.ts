
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolStripComponent } from './toolstrip.component';
import { PopoverComponent } from './popover/popover.component';
import { PopoverDirective } from './popover/popover.directive';

import { PopoverSegmentComponent } from './popover/popover.segment';

@NgModule({
  declarations: [
    ToolStripComponent,
    PopoverComponent,
    PopoverSegmentComponent,
    PopoverDirective
  ],
  imports: [
      MatDialogModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule,
  ],
  exports: [
    PopoverComponent,
    PopoverSegmentComponent,
    ToolStripComponent
  ]
})
export class ToolStripModule { }
