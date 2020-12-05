import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import {
    TestDate,
    TestDetails,
} from '../../../shared/interfaces/student.interfaces';

@Injectable()
export class StudentService {
    constructor(private http: HttpClient) {}

    getRecords(entity: string, id: string | number = ''): Observable<any> {
        return this.http.get<any>(
            `${environment.BASEURL}${entity}/getRecords/${id}`
        );
    }

    getTestDate(id: string): Observable<TestDetails[]> {
        return this.http.get<TestDetails[]>(
            `${environment.BASEURL}test/getTestsBySubject/${id}`
        );
    }

    getTestDetails(id: string): Observable<TestDate[]> {
        return this.http.get<TestDate[]>(
            `${environment.BASEURL}timeTable/getTimeTablesForSubject/${id}`
        );
    }
}
