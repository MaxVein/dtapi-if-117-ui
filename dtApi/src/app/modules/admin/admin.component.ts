import { Component, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { RouterState } from '../../shared/interfaces/student.interfaces';
import { Logged } from '../../shared/interfaces/auth.interfaces';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    menuIcon = 'menu_open';
    username: string;

    @HostBinding('class') componentCssClass;

    constructor(
        private apiService: AuthService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        public overlayContainer: OverlayContainer
    ) {
        this.getUserData();
    }

    getUserData(): void {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state) {
            const state = navigation.extras.state as RouterState;
            this.username = state.username;
        } else {
            this.apiService.isLogged().subscribe((response: Logged) => {
                this.username = response.username;
            });
        }
    }

    onSetTheme(theme: string): void {
        this.overlayContainer.getContainerElement().classList.add(theme);
        if (theme === 'default-theme') {
            this.overlayContainer
                .getContainerElement()
                .classList.remove('dark-theme');
        }
        this.componentCssClass = theme;
    }

    logOut(): void {
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
