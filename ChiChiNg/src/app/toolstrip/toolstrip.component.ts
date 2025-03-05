import { Component, Input } from '@angular/core';
import { PopoverComponent } from './popover/popover.component';

@Component({
    selector: 'chichi-toolstrip',
    imports: [
        PopoverComponent
    ],
    templateUrl: 'toolstrip.component.html',
    styleUrls: ['toolstrip.component.css']
})
export class ToolStripComponent {

}
