import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subscription } from 'rxjs';
import { Student, Subject } from '../../../shared/interfaces/entity.interfaces';
import { StudentProfile } from '../../../shared/interfaces/student.interfaces';

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
        private profileService: ProfileService,
        public modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getStudentInfo();
        this.getSubjectInfo();
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
                            `Ласкаво просимо ${response.student_surname} ${response.student_name} ${response.student_fname}`
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
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
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
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                }
            );
    }

    errorHandler(error: Response, title: string, message: string): void {
        this.modalService.openModal(AlertComponent, {
            data: {
                message,
                title,
                error,
            },
        });
    }

    ngOnDestroy(): void {
        if (this.profileSubscription) {
            this.profileSubscription.unsubscribe();
        }
    }
}
