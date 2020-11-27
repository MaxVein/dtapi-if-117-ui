import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

const BASEURL = environment.BASEURL;
const entityURI = `${BASEURL}Subject`;

interface SubjectsResponse {
    subject_id: number;
    subject_name: string;
    subject_description: string;
}
interface SubjectsRequest {
    subject_name: string;
    subject_description: string;
}

@Injectable({
    providedIn: 'root',
})
export class SubjectsService {
    constructor(private http: HttpClient) {}

    public getData(id?: string) {
        return this.http
            .get<SubjectsResponse[]>(`${entityURI}/getRecords/${id}`)
            .pipe(catchError(this.handleError));
    }

    public create = (body: SubjectsRequest) => {
        return this.http
            .post<SubjectsResponse>(
                `${entityURI}/insertData`,
                body,
                this.generateHeaders()
            )
            .pipe(catchError(this.handleError));
    };

    public update = (id: number, body: SubjectsRequest) => {
        return this.http
            .post<SubjectsResponse>(
                `${entityURI}/update/${id}`,
                body,
                this.generateHeaders()
            )
            .pipe(catchError(this.handleError));
    };

    public delete = (id: number) => {
        return this.http
            .delete(`${entityURI}/del/${id}`)
            .pipe(catchError(this.handleError));
    };

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`
            );
        }
        return throwError('Something bad happened; please try again later.');
    }

    private generateHeaders = () => {
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
    };
}
