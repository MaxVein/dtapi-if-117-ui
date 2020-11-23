import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { AuthService } from 'src/app/modules/login/services/auth.service'

@Injectable({
    providedIn: 'root',
})
export class StudentGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.getCurrentUser().pipe(
            map((currentUser) => {
                const allowed = currentUser.roles.includes('student')
                if (!allowed) {
                    this.router.navigate(['admin'])
                }
                return allowed
            })
        )
    }
}
