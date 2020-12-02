import { Component, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

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
        private breakpointObserver: BreakpointObserver,
        public overlayContainer: OverlayContainer
    ) {}

    @HostBinding('class') componentCssClass;

    onSetTheme(theme: string): void {
        this.overlayContainer.getContainerElement().classList.add(theme);
        if (theme === 'default-theme') {
            this.overlayContainer
                .getContainerElement()
                .classList.remove('dark-theme');
        }
        this.componentCssClass = theme;
    }

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
