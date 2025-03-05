import { Component, ChangeDetectionStrategy, ViewChild, OnInit, NgZone, AfterViewInit } from '@angular/core';

import { loadCartFromFile, loadCartFromUrl } from '../chichi/wishbone/filehandler';

import { BaseCart } from 'chichines';

import * as THREE from 'three';
import { DialogService } from './dialog.service';
import { createWishboneFactory, Wishbone, WishboneIO } from '../chichi/wishbone/wishbone';


import { setupVideoThreeJS } from '../chichi/wishbone/video';
//import { WishboneAudioFactory } from '../chichi/wishbone/audio';
import { WishboneControlPads } from '../chichi/wishbone/controlpads';

import { LocalAudioSettings } from '../chichi/threejs/audio.localsettings';
import { WishboneRuntime, createWishboneRuntime } from '../chichi/wishbone/runtime';

import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonModule } from '@angular/common';
import { WishboneAudio } from '../chichi/wishbone/audio';
import { ToolStripComponent } from './toolstrip/toolstrip.component';
import { PopoverComponent } from './toolstrip/popover/popover.component';
import { MachineInfoComponent } from '../machine_info/machine-info.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, ToolStripComponent, PopoverComponent, MachineInfoComponent],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(document:keydown)': 'onkeydown($event)',
    '(document:keyup)': 'onkeyup($event)'
  }
})
export class AppComponent implements AfterViewInit {

  setupIO: (wishbone: Wishbone) => WishboneIO;
  title = 'ChiChiNg';

  @ViewChild('chichiCanvas') chichiCanvas;

  cart?: BaseCart;
  audio?: LocalAudioSettings;
  runtime?: WishboneRuntime;
  wishbone?: Wishbone;

  paused = false;
  muted = false;
  //audioFactory: WishboneAudioFactory;

  constructor(
    public zone: NgZone,
    public dialogService: DialogService,
    public route: ActivatedRoute) {
      // this.audioFactory = new WishboneAudioFactory();
      // this.audioFactory.init().then(x =>{
      //   console.log(`audio initialized`);
      // });
  }

  ngAfterViewInit(): void {

    this.setupIO = updateIO([
      WishboneControlPads.setupKeyboards(this),
      WishboneAudio.setupAudioThreeJS(),
      setupVideoThreeJS({ canvas: this.chichiCanvas.nativeElement })
    ])(undefined);

    this.route.queryParams.pipe(filter(param => param.url)).subscribe(p => {
      (async () => {
        const cart = await loadCartFromUrl('https://cors-anywhere.herokuapp.com/' + p.url);
        if (cart) {
          this.cart = cart;
          await this.runCart(cart);
        }
      })();
    });
  }

  mute(value: boolean) {
    value ? this.audio.mute() : this.audio.unmute();
  }

  pause(value: boolean) {
    if (this.runtime) {
      this.runtime.pause(value);
    }
  }

  onkeydown(event) { }

  onkeyup(event) { }

  loadfile(e: Event) {
    (async () => {
      let file: File;
      if (e.target == null) {
        return;
      }
      let elem: HTMLInputElement = <HTMLInputElement>e.target;
      if (!!elem && !!elem.files) {
        const cart = await loadCartFromFile(elem.files[0]);
        this.cart = cart;
        await this.runCart(cart);
      }
    })();
  }

  runCart(value: BaseCart) {

    return (async () => {
      if (this.runtime) {
        await this.runtime.teardown();
      }

      const wishbone = loadWishbone(value);
      wishbone.poweron();
      const setupRuntime = createWishboneRuntime(wishbone);

      const wbio = this.setupIO(wishbone);

      this.wishbone = wishbone;
      this.audio = wbio.audio;
      this.zone.runOutsideAngular(() => {
        this.runtime = setupRuntime(wbio);
      });
    })();
  }
}

const loadWishbone = createWishboneFactory();

// tslint:disable-next-line:max-line-length
const updateIO = (updaters: Array<(wishbone?: Wishbone) => (io: WishboneIO) => WishboneIO>) => (wbio: WishboneIO) => (wishbone: Wishbone) => {
  const ioBuilders = updaters.map(fact => fact(wishbone));
  ioBuilders.forEach(builder => {
    wbio = builder(wbio);
  });
  return wbio;
};
