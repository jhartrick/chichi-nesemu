import { Type } from '@angular/core';

export class PopoverContent {
  constructor(public component: Type<any>, public data: any) {
    if (data.onclick) {
        this.onclick = data.onclick;
    }
  }

  onclick(event: any): void {

  }
}

