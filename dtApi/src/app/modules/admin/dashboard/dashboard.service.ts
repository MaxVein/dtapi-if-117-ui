import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { pluck } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable()
export class DashboardService {
    constructor(private httpInstance: HttpClient) {}

    getFacultiesNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}Faculty/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
    getGroupsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}Group/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
    getSpecialitiesNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}Speciality/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
    getSubjectsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}Subject/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
    getStudentsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}Student/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
    getAdminsNumber(): Observable<any> {
        return this.httpInstance
            .get(`${environment.BASEURL}AdminUser/countRecords`)
            .pipe(pluck('numberOfRecords'));
    }
}
