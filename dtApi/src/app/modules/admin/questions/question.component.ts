import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import {
    QuestionDataAfterClosed,
    QuestionInstance,
    typeReverse,
} from './Question';
import { QuestionService } from './question.service';
import { UpdateQuestionModalComponent } from './update-question-modal/update-question-modal.component';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    providers: [QuestionService],
})
export class QuestionComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'Text', 'Type', 'Level', 'operations'];
    dataSource: MatTableDataSource<[]>;
    questionsArray: Array<QuestionInstance> = [];
    subscribed = true;

    test_id: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private questionService: QuestionService,
        private snackBar: MatSnackBar
    ) {}

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    openModal(operationType: string, question?: QuestionInstance): void {
        switch (operationType) {
            case 'Add':
                this.addQuestionModelOpen();
                break;
            case 'Update':
                this.updateQuestionModelOpen(question);
                break;
            case 'Delete':
                this.deleteQuestionModalOpen(question);
                break;
        }
    }
    deleteQuestionModalOpen(question: QuestionInstance): void {
        this.dialog
            .open(DeleteConfirmationModalComponent, {
                data: {
                    title: 'Підтвердіть дію',
                    question: question,
                },
            })
            .afterClosed()
            .subscribe((res) => {
                if (!res) return;

                if (res.finished) {
                    this.dataSource.data.splice(
                        this.dataSource.data.indexOf(res.question),
                        1
                    );
                    this.dataSource._updateChangeSubscription();
                    this.dataSource.paginator = this.paginator;
                }
            });
    }
    updateQuestionModelOpen(question: any): void {
        this.dialog
            .open(UpdateQuestionModalComponent, {
                data: {
                    question: question,
                },
            })
            .afterClosed()
            .subscribe((res: QuestionDataAfterClosed) => {
                if (!res || !res.finished) return null;
                res.updatedquestion.type = typeReverse(
                    res.updatedquestion.type
                );
                const oldindex = this.dataSource.data.findIndex(
                    (item) => item === question
                );
                this.dataSource.data = this.dataSource.data.map(
                    (curQuestion: any, curIndex) => {
                        return curIndex === oldindex
                            ? (curQuestion = res.updatedquestion)
                            : curQuestion;
                    }
                );
            });
    }
    addQuestionModelOpen(): void {
        this.router.navigate(
            [`admin/subjects/tests/${this.test_id}/questions/answer`],
            {
                queryParams: {
                    test_id: this.test_id,
                },
            }
        );
    }

    ngOnInit(): void {
        this.activeRoute.params.subscribe(
            (params) => (this.test_id = params['id'])
        );
        this.questionService
            .getNumberOfQuestions(this.test_id)
            .subscribe((numbersOfRecords: number) => {
                if (numbersOfRecords === 0) {
                    this.snackBar.open(
                        'В базі даних немає питань по даному предмету',
                        'X',
                        {
                            duration: 3000,
                        }
                    );
                    return null;
                }
                this.questionService
                    .getQuestions(this.test_id, numbersOfRecords)
                    .subscribe((val: any) => {
                        this.dataSource = new MatTableDataSource(val);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
            });
    }

    redirectToAnswers(data) {
        this.router.navigate(
            [`admin/subjects/tests/${this.test_id}/questions/answer`],

            {
                queryParams: {
                    test_id: this.test_id,
                    mode: 'edit',
                },
                state: { data: data },
            }
        );
    }
}
