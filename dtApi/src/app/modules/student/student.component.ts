import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/login/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { RouterState } from '../../shared/interfaces/student.interfaces';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {
    username: string;

    @HostBinding('class') componentCssClass;

    constructor(
        private router: Router,
        private authService: AuthService,
        private themeService: ThemeService
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
    }

    logout(): void {
        this.authService.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
        });
    }

    ngOnDestroy(): void {
        localStorage.clear();
    }
}
