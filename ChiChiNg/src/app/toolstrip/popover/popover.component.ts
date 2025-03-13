import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
  } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'chichi-popover',
    imports: [MatIconModule],
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css'],
    animations: [
        // trigger('hoverAnimation', [
        //     state('*', style({
        //         transform: 'translateX(0%)'
        //     })),
        //     state('hover', style({
        //         transform: 'translateX(0%) scale(1.4)',
        //         color: 'yellow'
        //     })),
        //     transition('* => hover', animate('400ms 200ms ease-in', keyframes([
        //         style({ transform: 'translateX(0%)', offset: 0 }),
        //         style({ transform: 'translateX(12px)', offset: 0.5 }),
        //         style([{ transform: 'translateX(0%) scale(1.3)', offset: 1.0 }, { color: 'yellow', offset: 0.9 }])
        //     ]))),
        //     transition('hover => *', animate('500ms 100ms ease-out'))
        // ])

        trigger('hoverAnimation', [
            state('*', style({
            })),
            state('hover', style({
                transform: 'scale(1.4)',
                color: 'yellow'
            })),
            transition('* => hover', animate('400ms 200ms ease-in', keyframes([
                style([{ transform: 'scale(1.3)', offset: 1.0 }, { color: 'yellow', offset: 0.9 }])
            ]))),
            transition('hover => *', animate('500ms 100ms ease-out'))
        ])
    ]
})
export class PopoverComponent{
    
    @Input() icon: string;

    @Input() title: string;

    @Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
    hoverState = '';
    constructor() {

    }
    
    click(x) {
      this.buttonClick.emit(x);
    }
 

}
