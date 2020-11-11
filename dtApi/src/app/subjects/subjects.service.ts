import { Injectable } from '@angular/core'
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
} from '@angular/common/http'

import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

const apiURI = 'https://dtapi.if.ua/api'
const entityURI = `${apiURI}/Subject`

interface Subjects {
    subject_id: number
    subject_name: string
    subject_description: string
}

@Injectable({
    providedIn: 'root',
})
export class SubjectsService {
    constructor(private http: HttpClient) {}

    public getData(route: string) {
        return this.http
            .get<Subjects[]>(`${entityURI}/${route}`)
            .pipe(catchError(this.handleError))
    }

    public create = (
        route: string,
        body: { subject_name: string; subject_description: string }
    ) => {
        return this.http
            .post<Subjects>(
                `${entityURI}/${route}`,
                body,
                this.generateHeaders()
            )
            .pipe(catchError(this.handleError))
    }

    public update = (
        route: string,
        body?: { subject_name: string; subject_description: string }
    ) => {
        return this.http
            .post<Subjects>(
                `${entityURI}/update/${route}`,
                body,
                this.generateHeaders()
            )
            .pipe(catchError(this.handleError))
    }

    public delete = (route: string) => {
        return this.http
            .delete(`${entityURI}/del/${route}`)
            .pipe(catchError(this.handleError))
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message)
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`
            )
        }
        return throwError('Something bad happened; please try again later.')
    }

    private generateHeaders = () => {
        return {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
    }
}
