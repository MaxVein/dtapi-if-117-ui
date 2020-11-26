import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `<mat-spinner class="mat-spinner"></mat-spinner>`,
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    constructor() {}

    @Input() value = 100;
    @Input() diameter = 100;
    @Input() mode = 'indeterminate';
    @Input() strokeWidth = 10;
    @Input() overlay = false;
    @Input() color = 'primary';
}
