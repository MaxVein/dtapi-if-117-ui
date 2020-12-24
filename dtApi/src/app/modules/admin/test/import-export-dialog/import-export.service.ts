import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export interface Records {
    numberOfRecords: string;
}

@Injectable({
    providedIn: 'root',
})
export class ImportExportService {
    questionsIds: [];
    constructor(private http: HttpClient) {}

    public getAnswers(entity, id): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}${entity}/getAnswersByQuestion/${id}`
        );
    }
    public getQuestions(entity, id, num): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}${entity}/getRecordsRangeByTest/${id}/${num}/0`
        );
    }
    public getCount(entity: string, id: string) {
        return this.http.get(
            `${environment.BASEURL}${entity}/countRecordsByTest/${id}`
        );
    }

    public importTests(entity, id): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}${entity}/getAnswersByQuestion/${id}`
        );
    }
    public insertData(entity, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/insertData`,
            payload
        );
    }
}
