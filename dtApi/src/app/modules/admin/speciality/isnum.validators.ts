import { FormControl } from '@angular/forms';

export class IsNumValidators {
    static isNum(control: FormControl): { [key: string]: boolean } {
        const value = Number(control.value);
        if (!Number.isInteger(value)) {
            return { isNum: true };
        }
        return null;
    }
}
