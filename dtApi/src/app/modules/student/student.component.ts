import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/login/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ModalService } from '../../shared/services/modal.service';
import { TestPlayerService } from './services/test-player.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { RouterState } from '../../shared/interfaces/student.interfaces';
import { TestPlayerResponse } from '../../shared/interfaces/test-player.interfaces';
import {
    DialogResult,
    Response,
} from '../../shared/interfaces/entity.interfaces';
import {
    cancelMessage,
    errorTitleMessage,
    logoutErrorMessage,
    sessionErrorMessage,
    testLogoutConfirmMessage,
    themeChangeMessage,
} from './Messages';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, OnDestroy {
    username: string;
    studentSubscription: Subscription;

    @HostBinding('class') componentCssClass;

    constructor(
        private router: Router,
        private authService: AuthService,
        private testPlayerService: TestPlayerService,
        private themeService: ThemeService,
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
            localStorage.setItem('user_id', state.id);
        } else {
            this.username = localStorage.getItem('username');
        }
    }

    onSetTheme(theme: string): void {
        this.componentCssClass = this.themeService.onSetTheme(theme);
        this.modalService.showSnackBar(themeChangeMessage(theme));
    }

    logout(): void {
        this.studentSubscription = this.authService.logOutRequest().subscribe({
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

    testInProgress(): void {
        this.studentSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe((response: TestPlayerResponse) => {
                if (response.testInProgress) {
                    this.modalService.openModal(
                        ConfirmComponent,
                        {
                            data: {
                                icon: 'exit_to_app',
                                message: testLogoutConfirmMessage,
                            },
                        },
                        (result: DialogResult) => {
                            if (result) {
                                this.resetSession();
                            } else if (!result) {
                                this.modalService.showSnackBar(cancelMessage);
                            }
                        }
                    );
                } else {
                    this.logout();
                }
            });
    }

    resetSession(): void {
        this.studentSubscription = this.testPlayerService
            .testPlayerResetSession()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response.response === 'Custom data has been deleted') {
                        this.logout();
                    }
                },
                (error: Response) => {
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        sessionErrorMessage
                    );
                }
            );
    }

    errorHandler(error: Response, title: string, message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title,
                error,
            },
        });
    }

    ngOnDestroy(): void {
        localStorage.clear();
    }
}
