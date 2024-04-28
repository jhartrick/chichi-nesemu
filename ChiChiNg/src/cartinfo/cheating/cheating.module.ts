
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GameGenieDialogComponent } from './gamegenie.dialog.component';
import { WishboneCheats } from './wishbone.cheats';

@NgModule({
  declarations: [
    GameGenieDialogComponent
  ],
  imports: [
      MatDialogModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule
  ],
  providers: [],
  exports: [
    GameGenieDialogComponent
  ]
})
export class CheatingModule { }
