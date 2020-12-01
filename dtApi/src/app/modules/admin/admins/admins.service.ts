import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdminsCrudService {
    private entity = 'AdminUser';
    constructor(private httpInstance: HttpClient) {}

    getAdmins(): Observable<any> {
        return this.httpInstance.get(
            `${environment.BASEURL}${this.entity}/getRecords`
        );
    }

    addAdmin(body: string): Observable<any> {
        return this.httpInstance.post(
            `${environment.BASEURL}${this.entity}/insertData`,
            body
        );
    }
    updateAdmin(body: string, id: string): Observable<any> {
        return this.httpInstance.post(
            `${environment.BASEURL}${this.entity}/update/${id}`,
            body
        );
    }
    deleteAdmin(id: string): Observable<any> {
        return this.httpInstance.delete(
            `${environment.BASEURL}${this.entity}/del/${id}`
        );
    }
    checkAdminName(username: string): Observable<any> {
        return this.httpInstance.get(
            `${environment.BASEURL}${this.entity}/checkUserName/${username}`
        );
    }
}
