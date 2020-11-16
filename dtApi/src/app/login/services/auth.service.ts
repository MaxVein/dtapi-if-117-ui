import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { BASE_URL } from '../../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    loginRequest(userName: string, password: string): Observable<any> {
        const url = '/login/index'
        const body = {
            username: userName,
            password: password,
        }
        return this.http.post(`${BASE_URL}${url}`, body)
    }

    logOutRequest() {
        const url = '/login/logout'
        return this.http
            .get(`${BASE_URL}${url}`, { observe: 'response' })
            .subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.router.navigate(['/login'])
                    }
                },
                (err) => {
                    console.error(err)
                }
            )
    }

    isLogged() {
        const url = '/login/isLogged'
        return this.http.get(`${BASE_URL}${url}`)
    }

    getLogo() {
        const url = '/welcome/logo'
        return this.http.get(`${BASE_URL}${url}`)
    }
}
