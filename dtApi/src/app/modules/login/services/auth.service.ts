import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'

import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser = null

    constructor(private http: HttpClient, private router: Router) {}

    loginRequest(userName: string, password: string): Observable<any> {
        const url = 'login/index'
        const body = {
            username: userName,
            password: password,
        }
        return this.http.post(`${environment.BASEURL}${url}`, body).pipe(
            tap((data) => {
                this.currentUser = data
            })
        )
    }

    logOutRequest() {
        return this.http.get(`${environment.BASEURL}login/logout`).pipe(
            tap(() => {
                this.currentUser = null
            })
        )
    }

    isLogged() {
        const url = 'login/isLogged'
        return this.http.get(`${environment.BASEURL}${url}`)
    }

    getLogo() {
        const url = 'welcome/logo'
        return this.http.get(`${environment.BASEURL}${url}`)
    }
}
