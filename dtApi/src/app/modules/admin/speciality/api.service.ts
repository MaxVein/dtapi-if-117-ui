import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { first, tap } from 'rxjs/operators'

import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    currentUser = null
    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private route: Router
    ) {}

    getEntity(entity: string, id?: number): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}${entity}/getRecords/${id ? id : ''}`
        )
    }
    addEntity(entity: string, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/insertData`,
            payload
        )
    }
    delEntity(entity: string, id: number): Observable<any> {
        return this.http.get(`${environment.BASEURL}${entity}/del/${id}`)
    }
    updateEntity(entity: string, id: number, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/update/${id}`,
            payload
        )
    }
    snackBarOpen(): any {
        return this.snackBar.open('Щось пішло не так:(', '', {
            duration: 1500,
        })
    }
    login(username, password): Observable<any> {
        const body = {
            username,
            password,
        }
        return this.http.post(`${environment.BASEURL}Login/index`, body).pipe(
            tap((data) => {
                this.currentUser = data
            })
        )
    }
    logout() {
        return this.http.get(`${environment.BASEURL}login/logout`).pipe(
            tap(() => {
                this.currentUser = null
                return this.route.navigate(['/login'])
            })
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
                    return this.route.navigate(['/login'])
                }
                this.currentUser = data
            })
        )
    }
}
