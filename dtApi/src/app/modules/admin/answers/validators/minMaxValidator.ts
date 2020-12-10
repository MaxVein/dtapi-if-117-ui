import { FormGroup, ValidationErrors } from '@angular/forms';

export function minMaxValidator(group: FormGroup): ValidationErrors {
    const minValue: number = group.get('numericAnswerMin').value;
    const maxValue: number = group.get('numericAnswerMax').value;

    return minValue >= maxValue
        ? {
              comparisonError: true,
          }
        : null;
}
