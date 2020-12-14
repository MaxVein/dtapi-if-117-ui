import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ModalService } from '../../shared/services/modal.service';
import { AuthService } from './auth.service';
import { Logged, Logo, Login } from '../../shared/interfaces/auth.interfaces';
import { Response } from '../../shared/interfaces/entity.interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    hide = true;
    badRequest = false;
    errorMessage: string;
    logoSrc: string;

    private userName: string;
    private password: string;

    constructor(
        public modalService: ModalService,
        private request: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [''],
            password: [''],
        });
        this.getLogo();
    }

    onSubmit(): void {
        const formValue: Login = this.loginForm.value;
        this.userName = formValue.userName;
        this.password = formValue.password;
        this.request.loginRequest(this.userName, this.password).subscribe({
            next: (res: Logged) => {
                const goTo = res.roles.includes('admin') ? 'admin' : 'student';
                localStorage.setItem('role', goTo);
                const navigationExtras: NavigationExtras = {
                    state: { username: res.username, id: res.id },
                };
                this.router.navigate([goTo], navigationExtras);
            },
            error: (error: Response) => {
                this.loginForm.reset();
                this.handlerError(error);
            },
        });
    }

    handlerError(err: any): void {
        if (err.error.response === 'Invalid login or password') {
            this.modalService.showSnackBar('Неправильний логін або пароль');
        }
    }

    getLogo(): void {
        this.request.getLogo().subscribe((res: Logo) => {
            this.logoSrc = res.logo;
        });
    }
    fixOutlineStyle(input: any): void {
        input.updateOutlineGap();
    }
}
