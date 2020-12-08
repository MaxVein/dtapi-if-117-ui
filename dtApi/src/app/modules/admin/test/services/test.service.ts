import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TestService {
    constructor(private http: HttpClient) {}

    getEntity(entity: string, id?: number): Observable<any> {
        if (id === undefined) {
            return this.http.get(`${environment.BASEURL}${entity}/getRecords`);
        }
        return this.http.get(
            `${environment.BASEURL}${entity}/getRecords/${id}`
        );
    }
    getTests(entity: string, id?: number): Observable<any> {
        if (id === undefined) {
            return this.http.get(
                `${environment.BASEURL}${entity}/getTestsBySubject/`
            );
        }
        return this.http.get(
            `${environment.BASEURL}${entity}/getTestsBySubject/${id}`
        );
    }
    getTestDetailes(subEntity: string, id?: number): Observable<any> {
        if (id === undefined) {
            return this.http.get(
                `${environment.BASEURL}/testDetail/${subEntity}`
            );
        }
        return this.http.get(
            `${environment.BASEURL}/testDetail/${subEntity}/${id}`
        );
    }
    createEntity(entity: string, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/insertData`,
            payload
        );
    }
    deleteEntity(entity: string, id: number): Observable<any> {
        return this.http.delete(`${environment.BASEURL}${entity}/del/${id}`);
    }
    updateEntity(entity: string, payload, id: number): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/update/${id}`,
            payload
        );
    }
}
