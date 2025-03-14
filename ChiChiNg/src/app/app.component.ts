import { Component, ChangeDetectionStrategy, ViewChild, OnInit, NgZone, AfterViewInit, Inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { loadCartFromFile, loadCartFromUrl } from '../chichi/wishbone/filehandler';
import { BaseCart, GameGenieCode } from 'chichines';
import { DialogService } from './dialog.service';
import { Wishbone, WishboneIO } from '../chichi/wishbone/wishbone';


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
import { MachineInfoComponent } from './machine_info/machine-info.component';
import { WISHBONE_INST } from './app.module';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { WishboneCheats } from '../cartinfo/cheating/wishbone.cheats';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, ToolStripComponent, PopoverComponent, MachineInfoComponent, SidePanelComponent],
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(document:keydown)': 'onkeydown($event)',
        '(document:keyup)': 'onkeyup($event)'
    },
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppComponent implements AfterViewInit {

  setupIO: (wishbone: Wishbone) => WishboneIO;
  title = 'ChiChiNg';

  @ViewChild('chichiCanvas') chichiCanvas;

  cart?: BaseCart;
  audio?: LocalAudioSettings;
  runtime?: WishboneRuntime;
  cheats: GameGenieCode[] = [];
  hasCheats = false;

  paused = false;
  muted = false;
  debugging = false;
  //audioFactory: WishboneAudioFactory;

  constructor(
    public zone: NgZone,
    public dialogService: DialogService,
    public route: ActivatedRoute,
    @Inject(WISHBONE_INST) public wishbone: Wishbone,
    private cd: ChangeDetectorRef
  ) {
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
    this.cd.detectChanges();

  }

  mute(value: boolean) {
    value ? this.audio.mute() : this.audio.unmute();
    this.cd.detectChanges();
  }

  pause(value: boolean) {
    if (this.runtime) {
      this.runtime.pause(value);
    }
    this.cd.detectChanges();
  }

  toggleDebug() {
    this.debugging=!this.debugging;
    this.wishbone.enableDebug(this.debugging);
    
    this.cd.detectChanges();

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

  runCart= async (value: BaseCart) =>{

    if (this.runtime) {
      await this.runtime.teardown();
    }

    this.wishbone.loadcart(value);
    this.wishbone.poweron();

    const setupRuntime = createWishboneRuntime(this.wishbone);

    const wbio = this.setupIO(this.wishbone);
    
    this.audio = wbio.audio;
    this.zone.runOutsideAngular(() => {
      this.runtime = setupRuntime(wbio);
      this.wishbone.runtime = this.runtime;
    });
    this.cheats = await WishboneCheats.fetchCheats(value.ROMHashFunction);
    this.hasCheats = this.cheats.length > 1;

    this.cd.detectChanges();

    return this.wishbone;
  }

  showCheats = ()=> {
    this.dialogService.showCheats(this.cart, this.wishbone, this.cheats)
    this.cd.detectChanges();
  }
}



// tslint:disable-next-line:max-line-length
const updateIO = (updaters: Array<(wishbone?: Wishbone) => (io: WishboneIO) => WishboneIO>) => (wbio: WishboneIO) => (wishbone: Wishbone) => {
  const ioBuilders = updaters.map(fact => fact(wishbone));
  ioBuilders.forEach(builder => {
    wbio = builder(wbio);
  });
  return wbio;
};
