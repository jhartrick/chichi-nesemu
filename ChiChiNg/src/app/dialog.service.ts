import { HttpClient } from "@angular/common/http";
import { BaseCart } from "chichi";
import { CartInfoDialogComponent } from "../cartinfo/cartinfo-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { Wishbone } from "../chichi/wishbone/wishbone";
import { WishboneCheats } from "../cartinfo/cheating/wishbone.cheats";
import { GameGenieDialogComponent } from "../cartinfo/cheating/gamegenie.dialog.component";

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) {
    }

    showCartInfo (cart: BaseCart) {
        (async ()=> {
            try {
                const response = await fetch(`assets/carts/${cart.ROMHashFunction}.json`);
                const info = await response.json();
                const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                    height: '80%',
                    width: '60%',
                    data: { cart: cart, info: info }
                });
            } catch(e) {
                console.log('', e.message);
                const dialogRef = this.dialog.open(CartInfoDialogComponent, {
                        height: '80%',
                        width: '60%',
                        data: { cart: cart, info: {} }
                    });
                }
        })();
    }

    showCheats (cart: BaseCart, wishbone: Wishbone) {
   
        (async () => {
            const cheats = await  WishboneCheats.fetchCheats(cart.ROMHashFunction);
            const dialogRef = this.dialog.open(GameGenieDialogComponent, {
                height: '80%',
                width: '60%',
                data: { codes: cheats }
            });
            dialogRef.afterClosed().subscribe(() => {
                WishboneCheats.applyCheats(wishbone.chichi.Cpu)(cheats);
            });
        })();
    }
}