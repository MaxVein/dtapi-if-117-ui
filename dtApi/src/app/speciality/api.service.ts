import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'

import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    getEntity(entity: string, id?: number): Observable<any> {
        return this.http.get(
            `${environment.apiUrl}/${entity}/getRecords/${id ? id : ''}`
        )
    }
    addEntity(entity: string, payload): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/${entity}/insertData`,
            payload
        )
    }
    delEntity(entity: string, id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}/${entity}/del/${id}`)
    }
    updateEntity(entity: string, id: number, payload): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}/${entity}/update/${id}`,
            payload
        )
    }
    snackBarOpen(): any {
        return this.snackBar.open('Щось пішло не так:(', '', {
            duration: 1500,
        })
    }
    login(): Observable<any> {
        return this.http.post(`${environment.apiUrl}/Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
}
