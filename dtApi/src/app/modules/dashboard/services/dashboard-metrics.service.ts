import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ArrayType } from '@angular/compiler'

@Injectable()
export class DashboardMetricsService {
    constructor(private httpInstance: HttpClient) {}
    getFacultiesNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Faculty/getRecords'
        )
    }
    getSubjectsNumber(): Observable<any> {
        return this.httpInstance.get(
            'https://dtapi.if.ua/api/Subjects/getRecords'
        )
    }
    // BackendLogin(): Observable<object> {
    //     return this.httpInstance.post('https://dtapi.if.ua/api/Login/index', {
    //         username: 'admin',
    //         password: 'dtapi_admin',
    //     })
    // }
}
