import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    getEntity(entity: string, id?: number): Observable<any> {
        return this.http.get(
            `${environment.BASEURL}${entity}/getRecords/${id ? id : ''}`
        );
    }
    addEntity(entity: string, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/insertData`,
            payload
        );
    }
    delEntity(entity: string, id: number): Observable<any> {
        return this.http.get(`${environment.BASEURL}${entity}/del/${id}`);
    }
    updateEntity(entity: string, id: number, payload): Observable<any> {
        return this.http.post(
            `${environment.BASEURL}${entity}/update/${id}`,
            payload
        );
    }
    snackBarOpen(): any {
        return this.snackBar.open('Щось пішло не так:(', '', {
            duration: 1500,
        });
    }
}
