import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { Component, Inject, ChangeDetectorRef, ElementRef, AfterContentInit } from '@angular/core';
import { BaseCart } from 'chichines';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CartInformation } from '../app/dialog.service';

@Component({
    selector: 'cartinfo-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatTabsModule,
        MatExpansionModule,
        MatIconModule],
    templateUrl: './cartinfo-dialog.component.html',
    styleUrls: ['./cartinfo-dialog.component.css']
})
export class CartInfoDialogComponent implements AfterContentInit {

    board: any;
    game: any;
    cartridge: any;
    romInfo: BaseCart;
    cartInfo: any;

    constructor(
        public dialogRef: MatDialogRef<CartInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CartInformation,
        private cd: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {
        this.romInfo = data.cart;
        this.cartInfo = data.info;
        if (this.data.info && this.data.info.cartridge) {
            this.cartridge = this.data.info.cartridge;
            if (this.cartridge.board) {
                this.board = this.cartridge.board;
            }
            if (this.cartridge.game) {
                this.game = this.cartridge.game;
            }
        }
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 0);
    }

    apply() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
