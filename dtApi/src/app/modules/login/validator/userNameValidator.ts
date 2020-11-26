import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Responce } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class ForbiddenValidator implements AsyncValidator {
    constructor(private validationService: AuthService) {}
    validate(cntr: AbstractControl) {
        return this.validationService.getUserName(cntr.value).pipe(
            map((forbidden: Responce) =>
                forbidden.response ? null : { forbiddenValidator: true }
            ),
            catchError(() => of(null))
        );
    }
}
