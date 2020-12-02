import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormBuilder } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ForbiddenValidator } from './validator/userNameValidator';
import { Logged, Logo, Login } from '../../shared/interfaces/auth.interfaces';

@Component({
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('1s ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('1s ease-in', style({ opacity: 0 })),
            ]),
        ]),
    ],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm = this.fb.group({
        userName: [
            '',
            // {
            //     validators: [Validators.required],
            //     // asyncValidators: [
            //     //     this.userNameValidator.validate.bind(
            //     //         this.userNameValidator
            //     //     ),
            //     // ],
            //     // updateOn: 'blur',
            // },
        ],
        password: [''],
    });
    // get userName() {
    //     const userNameValue = this.loginForm.get('userName')
    //     return userNameValue
    // }
    hide = true;
    badRequest = false;
    errorMessage: string;
    logoSrc: string;

    private userName: string;
    private password: string;

    constructor(
        private request: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private userNameValidator: ForbiddenValidator
    ) {
        this.loginForm;
    }

    ngOnInit(): void {
        this.getLogo();
    }

    onSubmit(): void {
        const formValue: Login = this.loginForm.value;
        this.userName = formValue.userName;
        this.password = formValue.password;
        this.loginForm.reset();
        this.request.loginRequest(this.userName, this.password).subscribe({
            next: (res: Logged) => {
                const goTo = res.roles.includes('admin') ? 'admin' : 'student';
                localStorage.setItem('role', goTo);
                const navigationExtras: NavigationExtras = {
                    state: { username: res.username, id: res.id },
                };
                this.router.navigate([goTo], navigationExtras);
            },
            error: (error) => {
                this.handlerError(error);
            },
        });
    }

    handlerError(err) {
        this.badRequest = true;
        this.errorMessage = err.error.response;
        this.removeErrorMessage();
    }

    removeErrorMessage() {
        setTimeout(() => {
            this.badRequest = false;
        }, 1500);
    }

    getLogo() {
        this.request.getLogo().subscribe((res: Logo) => {
            this.logoSrc = res.logo;
        });
    }
    fixOutlineStyle(input) {
        input.updateOutlineGap();
    }
}
