import { Route } from '@angular/compiler/src/core'
import { Injectable } from '@angular/core'
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Router,
    RouterStateSnapshot,
    Routes,
    UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiService } from 'src/app/modules/admin/speciality/api.service'

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private apiService: ApiService, private router: Router) {}
    canActivate(
        route: Route
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.apiService.getCurrentUser().pipe(
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
