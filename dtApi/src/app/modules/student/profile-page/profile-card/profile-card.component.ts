import { Component, Input } from '@angular/core';
import { Student } from '../../../../shared/interfaces/entity.interfaces';
import { SpecialityDataProfile } from '../../../../shared/interfaces/student.interfaces';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
    @Input() student: Student;
    @Input() facultyName: string;
    @Input() speciality: SpecialityDataProfile;
    @Input() groupName: string;
    defaultImage: string = environment.defaultImage;
}
