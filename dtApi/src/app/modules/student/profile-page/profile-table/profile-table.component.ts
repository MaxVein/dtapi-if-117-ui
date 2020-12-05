import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '../../../../shared/services/modal.service';
import { StudentService } from '../../services/student.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { of, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
    TestDate,
    TestDetails,
} from '../../../../shared/interfaces/student.interfaces';
import { Subject } from '../../../../shared/interfaces/entity.interfaces';

@Component({
    selector: 'app-profile-table',
    templateUrl: './profile-table.component.html',
    styleUrls: ['./profile-table.component.scss'],
})
export class ProfileTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() subjects: Subject[];
    @Input() firstSubject: Subject;
    hide = false;
    startSelect: string;
    subjectName: string;
    subjectID: string;
    testsBySubject: TestDetails[] = [];
    testDetails: TestDate[];
    dataSource = new MatTableDataSource<TestDate>();
    displayedColumns: string[] = [
        'Предмет',
        'Тест',
        'Початок',
        'Кінець',
        'Кількість завдань',
        'Тривалість тесту',
        'Кількість спроб',
        'Почати тестування',
    ];
    studentSubscription: Subscription;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        public modalService: ModalService,
        private router: Router,
        private studentService: StudentService
    ) {}

    ngOnInit(): void {
        this.hide = true;
        this.initSubjects();
        this.getTestInfo();
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    initSubjects(): void {
        this.startSelect = this.firstSubject.subject_name;
        this.subjectID = this.firstSubject.subject_id;
        this.subjectName = this.firstSubject.subject_name;
    }

    getTestInfo(): void {
        this.studentSubscription = this.studentService
            .getTestDate(this.subjectID)
            .pipe(
                concatMap((res: TestDetails[]) => {
                    if (res.length) {
                        this.testsBySubject = res;
                        this.modalService.showSnackBar('Тести завантажено');
                        return this.studentService.getTestDetails(
                            this.subjectID
                        );
                    } else {
                        this.testsBySubject = [];
                        this.hide = false;
                        this.modalService.showSnackBar('Тести відсутні');
                        return of();
                    }
                })
            )
            .subscribe({
                next: (res: TestDate) => {
                    let testDate = res[0] ? res[0] : res;
                    if (testDate.response === 'no records') {
                        testDate = {
                            end_date: 'Дані відсутні',
                            start_date: 'Дані відсутні',
                        };
                    }
                    this.testDetails = [...this.testsBySubject].map((test) => ({
                        ...test,
                        ...testDate,
                        subjectname: this.subjectName,
                    }));
                    this.dataSource = new MatTableDataSource(this.testDetails);
                    this.dataSource.paginator = this.paginator;
                },
                error: (error: Response) => {
                    this.errorHandler(
                        error,
                        'Помилка',
                        'Сталася помилка. Спробуйте знову'
                    );
                },
            });
    }

    selectSubject(event: MatSelectChange): void {
        const subjectData = event.value;
        this.subjectID = subjectData.id;
        this.subjectName = subjectData.name;
        this.startSelect = '';
        this.getTestInfo();
    }

    startTest(): void {
        this.router.navigate(['student/test-player']);
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
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe();
        }
    }
}
