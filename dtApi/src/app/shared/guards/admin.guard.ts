import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/login/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private apiService: AuthService, private router: Router) {}
    canActivate(
        route: Route
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.apiService.isLogged().pipe(
            map((data: any) => {
                if (data.response === 'non logged') {
                    this.router.navigate(['/login']);
                } else {
                    const goTo = data.roles.includes('admin');
                    if (!goTo) {
                        this.router.navigate(['student']);
                    }
                    return goTo;
                }
            })
        );
    }
}
