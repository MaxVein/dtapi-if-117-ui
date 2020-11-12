import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class GroupsService {
    apiURI = ''

    constructor(private http: HttpClient) {}

    public logIn() {
        return this.http.post(`${environment.apiUrl}Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    public getData(entity,id?) {
        return this.http.get(`${environment.apiUrl}/${entity}/getRecords/${id ? id : ''}`)
    }
    public insertData(id: number, payload) {
      return this.http.post(`${environment.apiUrl}Faculty/insertData/`, payload)
  }
}
