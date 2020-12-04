import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/modules/login/auth.service';

@Injectable({
    providedIn: 'root',
})
export class StudentGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isLogged().pipe(
            map((data: any) => {
                if (data.response === 'non logged') {
                    this.router.navigate(['/login']);
                } else {
                    const goTo = data.roles.includes('student');
                    if (!goTo) {
                        this.router.navigate(['admin']);
                    }
                    return goTo;
                }
            })
        );
    }
}
