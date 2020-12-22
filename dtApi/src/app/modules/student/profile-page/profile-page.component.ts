import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    Response,
    Subject,
} from '../../../shared/interfaces/entity.interfaces';
import { StudentProfile } from '../../../shared/interfaces/student.interfaces';
import { profileMessages } from '../Messages';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
    loading = false;
    studentProfileData: StudentProfile;
    subjects: Subject[] = [];
    profileSubscription: Subscription;
    groupId: number;

    constructor(
        private router: Router,
        private profileService: ProfileService,
        public modalService: ModalService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
        this.getSubjectInfo();
        this.isMatch();
    }

    getStudentInfo(): void {
        this.profileSubscription = this.profileService
            .getAllStudentData()
            .subscribe(
                (response: StudentProfile) => {
                    if (response) {
                        this.alertService.message(
                            profileMessages('welcome', response)
                        );
                        this.studentProfileData = response;
                        this.groupId = response.group_id;
                        this.loading = false;
                    } else {
                        this.studentProfileData = null;
                        this.loading = false;
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    this.alertService.error(profileMessages('student'));
                }
            );
    }

    getSubjectInfo(): void {
        this.profileSubscription = this.profileService
            .getRecords('Subject')
            .subscribe(
                (response: Subject[]) => {
                    if (response) {
                        this.subjects = response;
                    } else {
                        this.alertService.message(
                            profileMessages('emptySubjects')
                        );
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    this.alertService.error(profileMessages('subjects'));
                }
            );
    }

    isMatch(): void {
        const match = localStorage.getItem('isMatch');
        if (match === 'notMatch') {
            this.alertService.error(profileMessages('isMatch'));
        }
        localStorage.setItem('isMatch', null);
    }

    ngOnDestroy(): void {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
