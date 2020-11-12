import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    apiUrl = ''
    constructor(private http: HttpClient) {}

    getEntity(entity: string, id?: number): any {
        return this.http.get(
            `${environment.apiUrl}/${entity}/getRecords/${id ? id : ''}`
        )
    }
    addEntity(entity: string, payload): any {
        return this.http.post(
            `${environment.apiUrl}/${entity}/insertData`,
            payload
        )
    }
    delEntity(entity: string, id: number): any {
        return this.http.get(`${environment.apiUrl}/${entity}/del/${id}`)
    }
}
