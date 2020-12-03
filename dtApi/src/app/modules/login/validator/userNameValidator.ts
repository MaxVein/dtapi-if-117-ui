import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Response } from '../../../shared/interfaces/entity.interfaces';

@Injectable({ providedIn: 'root' })
export class ForbiddenValidator implements AsyncValidator {
    constructor(private validationService: AuthService) {}
    validate(cntr: AbstractControl) {
        return this.validationService.getUserName(cntr.value).pipe(
            map((forbidden: Response) =>
                forbidden.response ? null : { forbiddenValidator: true }
            ),
            catchError(() => of(null))
        );
    }
}
