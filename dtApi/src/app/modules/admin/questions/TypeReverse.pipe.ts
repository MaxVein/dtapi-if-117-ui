import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TypeReverse',
})
export class TypeReversePipe implements PipeTransform {
    transform(type: string): string {
        switch (+type) {
            case 1:
                type = 'Простий вибір';
                break;
            case 2:
                type = 'Мульти вибір';
                break;
            case 3:
                type = 'Текстове поле';
                break;
            case 4:
                type = 'Числове поле вводу';
                break;
        }
        return type;
    }
}
