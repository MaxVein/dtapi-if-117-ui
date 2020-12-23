import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Subject,
} from '../../../shared/interfaces/entity.interfaces';
import { StudentProfile } from '../../../shared/interfaces/student.interfaces';
import { profileMessages } from '../Messages';
import { TestPlayerResponse } from '../../../shared/interfaces/test-player.interfaces';
import { TestPlayerService } from '../services/test-player.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';

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
        private testPlayerService: TestPlayerService,
        public modalService: ModalService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
        this.getSubjectInfo();
        this.getSession();
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

    getSession(): void {
        this.profileSubscription = this.testPlayerService
            .testPlayerGetData()
            .subscribe(
                (response: TestPlayerResponse) => {
                    if (
                        response.id &&
                        response.currentTest &&
                        response.testInProgress
                    ) {
                        this.confirmContinueTest(
                            response.currentTest.test_name,
                            response.currentTest.subjectname
                        );
                    }
                },
                (error: Response) => {
                    this.alertService.error(profileMessages('getSessionError'));
                }
            );
    }

    confirmContinueTest(testName: string, subjectName: string): void {
        this.modalService.openModal(
            ConfirmComponent,
            {
                data: {
                    icon: 'school',
                    message: profileMessages(
                        'continueTest',
                        null,
                        testName,
                        subjectName
                    ),
                },
            },
            (result: DialogResult) => {
                if (result) {
                    this.router.navigate(['student/test-player']);
                } else if (!result) {
                    this.alertService.message(
                        profileMessages('snackbarCancel', null, testName)
                    );
                }
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
