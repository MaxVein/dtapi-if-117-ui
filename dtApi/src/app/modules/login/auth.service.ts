import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'src/app/shared/interfaces/entity.interfaces';
import { Logged, Logo } from 'src/app/shared/interfaces/auth.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser = null;

    constructor(private http: HttpClient) {}

    loginRequest(userName: string, password: string): Observable<Logged> {
        const body = {
            username: userName,
            password: password,
        };
        return this.http
            .post<Logged>(`${environment.BASEURL}login/index`, body)
            .pipe(
                tap((data) => {
                    this.currentUser = data;
                })
            );
    }

    logOutRequest(): Observable<Response> {
        return this.http
            .get<Response>(`${environment.BASEURL}login/logout`)
            .pipe(
                tap(() => {
                    this.currentUser = null;
                })
            );
    }

    isLogged(): Observable<Logged> {
        return this.http.get<Logged>(`${environment.BASEURL}login/isLogged`);
    }

    getLogo(): Observable<Logo> {
        return this.http.get<Logo>(`${environment.BASEURL}welcome/logo`);
    }
}
