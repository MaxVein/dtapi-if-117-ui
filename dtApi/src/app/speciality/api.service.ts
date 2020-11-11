import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    apiUrl = ''
    constructor(private http: HttpClient) {}

    getEntity(entity: string, id?: number) {
        return this.http.get(
            `${environment.apiUrl}/${entity}/getRecords/${id ? id : ''}`
        )
    }
    addEntity(entity: string, payload) {
        return this.http.post(
            `${environment.apiUrl}/${entity}/insertData`,
            payload
        )
    }
}
