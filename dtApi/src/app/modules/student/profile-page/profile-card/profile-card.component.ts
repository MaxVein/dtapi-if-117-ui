import { Component, Input } from '@angular/core';
import { StudentProfile } from '../../../../shared/interfaces/student.interfaces';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
    @Input() profileData: StudentProfile;
    defaultImage: string = environment.defaultImage;
}
