import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiService } from 'src/app/modules/admin/speciality/api.service'

export class StudentGuard implements CanActivate {
    constructor(private apiService: ApiService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.apiService.getCurrentUser().pipe(
            map((currentUser) => {
                const allowed = currentUser.roles.includes('students')
                if (!allowed) {
                    this.router.navigate(['404'])
                }
                return allowed
            })
        )
    }
}
