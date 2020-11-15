import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class GroupsService {
    apiURI = ''
    sharingData = []

    constructor(private http: HttpClient) {}
    public saveData(data: any) {
        this.sharingData.push(data)
    }
    public getsharedData() {
        return this.sharingData
    }
    public logIn() {
        return this.http.post(`${environment.apiUrl}/Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    public getData(entity, id?) {
        return this.http.get(
            `${environment.apiUrl}/${entity}/getRecords/${id ? id : ''}`
        )
    }
    public delData(entity, id?) {
        return this.http.get(
            `${environment.apiUrl}/${entity}/del/${id ? id : ''}`
        )
    }
    public insertData(entity, payload) {
        return this.http.post(
            `${environment.apiUrl}/${entity}/insertData`,
            payload
        )
    }
    public updateData(entity, id, payload) {
        return this.http.post(
            `${environment.apiUrl}/${entity}/update/${id}`,
            payload
        )
    }
}
