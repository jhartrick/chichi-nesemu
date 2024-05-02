import { DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DialogService } from './dialog.service';
import { RomLauncherComponent } from './rom-launcher/rom-launcher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    RomLauncherComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
  ],
  providers: [MatIconRegistry, HttpClient, DialogService],
})
export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

    matIconRegistry
      .addSvgIcon('gamepad', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/gamepad.svg'))
      .addSvgIcon('chip', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chip.svg'))
      .addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload.svg'))
      .addSvgIcon('power', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/power.svg'))
      .addSvgIcon('play', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/play.svg'))
      .addSvgIcon('pause', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pause.svg'))
      .addSvgIcon('stop', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stop.svg'))
      .addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'))
      .addSvgIcon('reset', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/reset.svg'))
      .addSvgIcon('volume-high', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-high.svg'))
      .addSvgIcon('volume-off', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/volume-off.svg'))
      .addSvgIcon('baby-buggy', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baby-buggy.svg'))
      .addSvgIcon('amplifier',  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/amplifier.svg'));
  }

 }
