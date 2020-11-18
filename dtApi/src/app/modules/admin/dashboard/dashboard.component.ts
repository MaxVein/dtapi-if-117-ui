/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { Component } from '@angular/core'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { map, shareReplay } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    menuIcon = 'menu_open'
    menuIconChange(): void {
        if (this.menuIcon === 'menu_open') {
            this.menuIcon = 'menu'
        } else {
            this.menuIcon = 'menu_open'
        }
    }
    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        )
    constructor(private breakpointObserver: BreakpointObserver) {}
}
