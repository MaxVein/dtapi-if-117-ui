import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../modules/login/auth.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ModalService } from '../../shared/services/modal.service';
import { AlertService } from '../../shared/services/alert.service';
import { TestPlayerService } from './services/test-player.service';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { RouterState } from '../../shared/interfaces/student.interfaces';
import {
    TestPlayerResponse,
    TestResult,
} from '../../shared/interfaces/test-player.interfaces';
import {
    DialogResult,
    Response,
} from '../../shared/interfaces/entity.interfaces';
import {
    logoutMessages,
    snackBarMessages,
    testPlayerServerMessages,
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
        private modalService: ModalService,
        private alertService: AlertService
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
        this.alertService.message(themeChangeMessage(theme));
    }

    logout(): void {
        this.studentSubscription = this.authService.logOutRequest().subscribe({
            next: () => {
                this.router.navigate(['/login']);
                this.alertService.message(logoutMessages('logout'));
            },
            error: () => {
                this.alertService.error(logoutMessages('error'));
            },
        });
    }

    testInProgress(): void {
        this.studentSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (response.testInProgress) {
                        this.confirmLogout();
                    } else {
                        this.logout();
                    }
                },
                (error: Response) => {
                    this.alertService.error(testPlayerServerMessages('get'));
                }
            );
    }

    confirmLogout(): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'exit_to_app',
                    message: logoutMessages('testInProcess'),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.checkTest();
                    this.resetSession();
                } else if (!result) {
                    this.alertService.message(snackBarMessages('cancel'));
                }
            }
        );
    }

    checkTest(): void {
        const testProgress = JSON.parse(
            sessionStorage.getItem('test_progress')
        );
        this.testPlayerService.checkDoneTest(testProgress).subscribe(
            (response: TestResult) => {
                this.alertService.warning(logoutMessages('result', response));
            },
            (error: Response) => {
                this.alertService.error(logoutMessages('checkError'));
            }
        );
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
                    this.alertService.message(
                        testPlayerServerMessages('reset')
                    );
                }
            );
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
        localStorage.clear();
        sessionStorage.clear();
    }
}
