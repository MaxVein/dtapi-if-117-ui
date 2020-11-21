import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class AdminsCrudService {
    private baseurl = environment.BASEURL
    private entity = 'AdminUser'
    constructor(private httpInstance: HttpClient) {}

    getAdmins(): Observable<any> {
        return this.httpInstance.get(`${this.baseurl}${this.entity}/getRecords`)
    }

    addAdmin(body: string): Observable<any> {
        return this.httpInstance.post(
            `${this.baseurl}${this.entity}/insertData`,
            body
        )
    }
    updateAdmin(body: string, id: string): Observable<any> {
        return this.httpInstance.post(
            `${this.baseurl}${this.entity}/update/${id}`,
            body
        )
    }
    deleteAdmin(id: string): Observable<any> {
        return this.httpInstance.delete(
            `${this.baseurl}${this.entity}/del/${id}`
        )
    }
}
