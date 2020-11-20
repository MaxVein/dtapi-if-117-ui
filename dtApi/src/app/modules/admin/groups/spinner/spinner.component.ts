import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-spinner',
    template: `<mat-spinner class="mat-spinner"></mat-spinner>`,
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
    constructor() {}

    @Input() value: number = 100
    @Input() diameter: number = 100
    @Input() mode: string = 'indeterminate'
    @Input() strokeWidth: number = 10
    @Input() overlay: boolean = false
    @Input() color: string = 'primary'
}
