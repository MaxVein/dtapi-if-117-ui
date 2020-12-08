import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/login/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Logged } from '../../shared/interfaces/auth.interfaces';
import { RouterState } from '../../shared/interfaces/student.interfaces';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
})
export class StudentComponent {
    username: string;

    @HostBinding('class') componentCssClass;

    constructor(
        private router: Router,
        private auth: AuthService,
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
            this.auth.isLogged().subscribe((response: Logged) => {
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

    logout(): void {
        this.auth.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
        });
    }
}
