import { Component, OnInit } from '@angular/core';
import { NESFileDecoder } from 'chichi';

export interface RomUrl {
  url: string;
  name: string;
}

@Component({
  selector: 'app-rom-launcher',
  templateUrl: './rom-launcher.component.html',
  styleUrls: ['./rom-launcher.component.css']
})
export class RomLauncherComponent implements OnInit {

  roms: RomUrl[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}

