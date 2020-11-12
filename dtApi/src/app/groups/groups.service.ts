import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class GroupsService {
    apiURI = 'https://dtapi.if.ua/api/'

    constructor(private http: HttpClient) {}

    public logIn() {
        return this.http.post(`${this.apiURI}Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    public getData() {
        return this.http.get(`${this.apiURI}Group/getRecords`)
    }
    public getSpec(id: number) {
        return this.http.get(`${this.apiURI}Speciality/getRecords/${id}`)
    }
    public getFac(id: number) {
        return this.http.get(`${this.apiURI}Faculty/getRecords/${id}`)
    }
}
