import { AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms'
import { Observable } from 'rxjs'

export function uniqueValidator(service: any, check: string): AsyncValidatorFn {
    return (
        control: FormControl
    ):
        | Promise<ValidationErrors | null>
        | Observable<ValidationErrors | null> => {
        switch (check) {
            case 'gradebookID':
                return service.check(
                    'Student',
                    'checkGradebookID',
                    control.value
                )
                break
            case 'username':
                return service.check(
                    'AdminUser',
                    'checkUserName',
                    control.value
                )
                break
            case 'email':
                return service.check(
                    'AdminUser',
                    'checkEmailAddress',
                    control.value
                )
                break
        }
    }
}
