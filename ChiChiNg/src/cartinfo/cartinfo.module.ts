import { CartInfoDialogComponent } from './cartinfo-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    CartInfoDialogComponent

  ],
  imports: [
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule

  ],
  exports: [
    CartInfoDialogComponent

  ]
})
export class CartInfoModule { }
