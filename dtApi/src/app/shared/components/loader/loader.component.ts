import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    template: `<mat-spinner class="mat-spinner"></mat-spinner>`,
    styles: [
        `
            .mat-spinner {
                width: 70px;
                height: 70px;
                top: 45%;
                left: 48%;
                position: fixed;
            }
        `,
    ],
})
export class LoaderComponent {}
