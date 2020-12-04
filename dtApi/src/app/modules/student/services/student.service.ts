import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class StudentService {
    constructor(private http: HttpClient) {}

    getRecords(entity: string, id: string | number = ''): Observable<any> {
        return this.http.get<any>(
            `${environment.BASEURL}${entity}/getRecords/${id}`
        );
    }

    getTestDate(id: string): Observable<any> {
        return this.http.get<any>(
            `${environment.BASEURL}test/getTestsBySubject/${id}`
        );
    }

    getTestDetails(id: string): Observable<any> {
        return this.http.get<any>(
            `${environment.BASEURL}timeTable/getTimeTablesForSubject/${id}`
        );
    }
}
