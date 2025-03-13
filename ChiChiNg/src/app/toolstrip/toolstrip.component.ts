import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
    selector: 'chichi-toolstrip',
    imports: [],
    templateUrl: 'toolstrip.component.html',
    styleUrls: ['toolstrip.component.css']
})
export class ToolStripComponent {
    @Input("align") public align: string = 'horiz'
    constructor(private cd: ChangeDetectorRef) {
    }
}
