import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subscription } from 'rxjs';
import {
    DialogResult,
    Response,
    Student,
    Subject,
} from '../../../shared/interfaces/entity.interfaces';
import { StudentProfile } from '../../../shared/interfaces/student.interfaces';
import {
    errorTitleMessage,
    isMatchErrorMessage,
    profileStudentMessage,
    profileSubjectsMessage,
    welcomeMessage,
} from '../Messages';

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

    constructor(
        private router: Router,
        private profileService: ProfileService,
        public modalService: ModalService
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
                (response: Student) => {
                    if (response) {
                        this.studentProfileData = response;
                        this.loading = false;
                        this.modalService.showSnackBar(
                            welcomeMessage(response)
                        );
                    } else {
                        this.studentProfileData = null;
                        this.loading = false;
                    }
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        profileStudentMessage
                    );
                }
            );
    }

    getSubjectInfo(): void {
        this.profileSubscription = this.profileService
            .getRecords('Subject')
            .subscribe(
                (response: Subject[]) => {
                    this.subjects = response;
                },
                (error: Response) => {
                    this.loading = false;
                    this.errorHandler(
                        error,
                        errorTitleMessage,
                        profileSubjectsMessage
                    );
                }
            );
    }

    isMatch(): void {
        const match = localStorage.getItem('isMatch');
        if (match === 'notMatch') {
            this.modalService.openModal(AlertComponent, {
                data: {
                    title: errorTitleMessage,
                    message: isMatchErrorMessage,
                },
            });
        }
        localStorage.setItem('isMatch', null);
    }

    errorHandler(error: Response, title: string, message: string): void {
        this.modalService.openModal(
            AlertComponent,
            {
                data: {
                    message,
                    title,
                    error,
                },
            },
            (result: DialogResult) => {
                if (!result) {
                    this.router.navigate(['/student/profile']);
                }
            }
        );
    }

    ngOnDestroy(): void {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
