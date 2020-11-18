import { Directive, Input } from '@angular/core'
import {
    AbstractControl,
    AsyncValidator,
    NG_ASYNC_VALIDATORS,
    ValidationErrors,
} from '@angular/forms'
import { StudentsService } from '../../services/students/students.service'
import { Observable } from 'rxjs'

@Directive({
    selector: '[appUnique]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: UniqueDirective,
            multi: true,
        },
    ],
})
export class UniqueDirective implements AsyncValidator {
    @Input('appUnique') check: string

    constructor(private studentService: StudentsService) {}

    validate(
        control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        const value = control.value
        switch (this.check) {
            case 'gradebookID':
                return this.studentService.check(
                    'Student',
                    'checkGradebookID',
                    value
                )
                break
            case 'username':
                return this.studentService.check(
                    'AdminUser',
                    'checkUserName',
                    value
                )
                break
            case 'email':
                return this.studentService.check(
                    'AdminUser',
                    'checkEmailAddress',
                    value
                )
                break
        }
    }
}
