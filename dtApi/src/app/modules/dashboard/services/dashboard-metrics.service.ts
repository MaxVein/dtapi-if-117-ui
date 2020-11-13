/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable()
export class DashboardMetricsService {
    private baseurl = environment.BASEURL
    constructor(private httpInstance: HttpClient) {}
    backendLogin(): Observable<any> {
        return this.httpInstance.post(`${this.baseurl}/api/Login/index`, {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
    getFacultiesNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/Faculty/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
    getGroupsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/Group/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
    getSpecialitiesNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/Speciality/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
    getSubjectsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/Subject/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
    getStudentsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/Student/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
    getAdminsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${this.baseurl}/api/AdminUser/countRecords`)
            .pipe(map((res: any) => res.numberOfRecords))
    }
}
