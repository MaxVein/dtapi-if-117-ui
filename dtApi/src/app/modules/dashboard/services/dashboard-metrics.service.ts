/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { environment } from 'src/environments/environment'

@Injectable()
export class DashboardMetricsService {
    private baseurl = environment.BASEURL
    constructor(private httpInstance: HttpClient) {}
    BackendLogin(): Observable<any> {
        return this.httpInstance.post(`${this.baseurl}/api/Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    getFacultiesNumber(): Observable<any> {
        return this.httpInstance.get(`${this.baseurl}/api/Faculty/countRecords`)
    }
    getGroupsNumber(): Observable<any> {
        return this.httpInstance.get(`${this.baseurl}/api/Group/countRecords`)
    }
    getSpecialitiesNumber(): Observable<any> {
        return this.httpInstance.get(
            `${this.baseurl}/api/Speciality/countRecords`
        )
    }
    getSubjectsNumber(): Observable<any> {
        return this.httpInstance.get(`${this.baseurl}/api/Subject/countRecords`)
    }
    getStudentsNumber(): Observable<any> {
        return this.httpInstance.get(`${this.baseurl}/api/Student/countRecords`)
    }
    getAdminsNumber(): Observable<any> {
        return this.httpInstance.get(
            `${this.baseurl}/api/AdminUser/countRecords`
        )
    }
}
