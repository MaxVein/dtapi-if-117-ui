import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    menuIcon = 'menu_open';

    constructor(
        private apiService: AuthService,
        private router: Router,
        private breakpointObserver: BreakpointObserver
    ) {}
    logOut() {
        this.apiService.logOutRequest().subscribe({
            next: () => this.router.navigate(['/login']),
        });
    }

    menuIconChange(): void {
        if (this.menuIcon === 'menu_open') {
            this.menuIcon = 'menu';
        } else {
            this.menuIcon = 'menu_open';
        }
    }

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );
}
