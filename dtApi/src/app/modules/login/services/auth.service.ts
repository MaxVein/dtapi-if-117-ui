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
    currentUser: string = null

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
        const url = 'login/logout'
        return this.http
            .get(`${environment.BASEURL}${url}`, { observe: 'response' })
            .subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.currentUser = null
                        this.router.navigate(['/login'])
                    }
                },
                (err) => {
                    console.error(err)
                }
            )
    }
    getCurrentUser() {
        if (this.currentUser) {
            return of(this.currentUser)
        }
        return this.http.get(`${environment.BASEURL}login/isLogged`).pipe(
            tap((data: any) => {
                if (data.response === 'non logged') {
                    this.currentUser = null
                    return this.router.navigate(['/login'])
                }
                this.currentUser = data
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
