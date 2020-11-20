import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { trigger, style, animate, transition } from '@angular/animations'
import { FormBuilder } from '@angular/forms'

import { logoSrc, loginForm } from './interfaces/interfaces'
import { AuthService } from './services/auth.service'

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
        userName: [''],
        password: [''],
    })
    hide = true
    badRequest = false
    errorMessage: string
    logoSrc: string

    private userName: string
    private password: string

    constructor(
        private request: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.loginForm
    }

    ngOnInit(): void {
        this.getLogo()
    }

    onSubmit(event) {
        event.preventDefault()
        const formValue: loginForm = this.loginForm.value
        this.userName = formValue.userName
        this.password = formValue.password
        this.loginForm.reset()

        this.request.loginRequest(this.userName, this.password).subscribe({
            next: (res) => {
                const goTo = res.roles.includes('admin')
                    ? 'admin'
                    : 'student-page'
                this.router.navigate([goTo])
            },
            error: (error) => {
                this.handlerError(error)
            },
        })
    }

    handlerError(err) {
        this.badRequest = true
        this.errorMessage = err.error.response
        this.removeErrorMessage()
    }

    removeErrorMessage() {
        setTimeout(() => {
            this.badRequest = false
        }, 1500)
    }

    getLogo() {
        this.request.getLogo().subscribe((res: logoSrc) => {
            this.logoSrc = res.logo
        })
    }
}
