/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'

@Injectable()
export class DashboardMetricsService {
    constructor(private httpInstance: HttpClient) {}
    getFacultiesNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Faculty/countRecords'
        )
    }
    getGroupsNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Group/countRecords'
        )
    }
    getSpecialitiesNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Speciality/countRecords'
        )
    }
    getSubjectsNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Subject/countRecords'
        )
    }
    getStudentsNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Student/countRecords'
        )
    }
    getAdminsNumber(): Observable<any> {
        return this.httpInstance.get(
            'http://dtapi.if.ua/api/AdminUser/countRecords'
        )
    }
    BackendLogin(): Observable<any> {
        return this.httpInstance.post('https://dtapi.if.ua/api/Login/index', {
            username: 'admin',
            password: 'dtapi_admin',
        })
    }
}
