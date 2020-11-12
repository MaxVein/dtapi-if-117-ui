import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { environment } from '../../../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class TestService {
    constructor(private http: HttpClient) {}
    getEntity(entity: string, id?: number): Observable<any> {
        if (id === undefined) {
            return this.http.get(`${environment.apiUrl}/${entity}/getRecords`)
        }
        return this.http.get(`${environment.apiUrl}/${entity}/getRecords/${id}`)
    }
    createEntity(entity: string, payload): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}${entity}/insertData`,
            payload
        )
    }
    deleteEntity(entity: string, id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}${entity}/del/${id}`)
    }
    updateEntity(entity: string, payload, id: number): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}${entity}/update/${id}`,
            payload
        )
    }
}
