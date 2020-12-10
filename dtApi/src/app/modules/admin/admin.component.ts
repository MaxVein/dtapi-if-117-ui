import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../login/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ModalService } from '../../shared/services/modal.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterState } from '../../shared/interfaces/student.interfaces';
import {
    errorTitleMessage,
    logoutErrorMessage,
    themeChangeMessage,
} from '../student/Messages';
@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
    menuIcon = 'menu_open';
    username: string;

    @HostBinding('class') componentCssClass;

    constructor(
        private apiService: AuthService,
        private themeService: ThemeService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private modalService: ModalService
    ) {
        this.getUserData();
    }

    ngOnInit(): void {
        this.componentCssClass = this.themeService.initTheme();
    }

    getUserData(): void {
        const navigation = this.router.getCurrentNavigation();
        if (navigation.extras.state) {
            const state = navigation.extras.state as RouterState;
            this.username = state.username;
            localStorage.setItem('username', state.username);
        } else {
            this.username = localStorage.getItem('username');
        }
    }

    onSetTheme(theme: string): void {
        this.componentCssClass = this.themeService.onSetTheme(theme);
        this.modalService.showSnackBar(themeChangeMessage(theme));
    }

    logOut(): void {
        this.apiService.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: () => {
                this.modalService.openModal(AlertComponent, {
                    data: {
                        title: errorTitleMessage,
                        message: logoutErrorMessage,
                    },
                });
            },
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

    ngOnDestroy(): void {
        localStorage.clear();
    }
}
