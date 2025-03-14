
import { Component, ElementRef } from '@angular/core';
import Profile from './memorypage';
import ReactDOM from 'react-dom/client';
import React from 'react';

@Component({
  selector: 'app-react-wrapper',
  template: '<div #reactContainer></div>',
})
export class ReactWrapperComponent {
  root: ReactDOM.Root;
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.root = ReactDOM.createRoot(this.elementRef.nativeElement);
    let p = [];
    for (let i =0; i<256; ++i) {
      p.push(i.toString(16))
    }
    this.root.render(
      <Profile page={p} />
    );
  }
}