import { Route } from '@angular/compiler/src/core'
import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthService } from 'src/app/modules/login/services/auth.service'

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: Route
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.getCurrentUser().pipe(
            map((currentUser) => {
                const allowed = currentUser.roles.includes('admin')
                if (!allowed) {
                    this.router.navigate(['404'])
                }
                return allowed
            })
        )
    }
}
