import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { QuestionService } from './question.service';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    providers: [QuestionService],
})
export class QuestionComponent implements OnInit {
    displayedColumns: string[] = ['id', 'Text', 'Type', 'Level', 'operations'];
    dataSource: MatTableDataSource<[]>;
    questionsArray: any[] = [];
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

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    openModal(operationType: string, question?: any): void {
        switch (operationType) {
            case 'Add':
                this.addQuestionModelOpen();
                break;
            case 'Update':
                this.updateQuestionModelOpen();
                break;
            case 'Delete':
                this.deleteQuestionModalOpen(question);
                break;
        }
    }
    deleteQuestionModalOpen(question: any): void {
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
    updateQuestionModelOpen(): void {
        this.router.navigate(
            [`admin/subjects/tests/${this.test_id}/questions/answer`],
            {
                queryParams: {
                    test_id: this.test_id,
                },
            }
        );
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
                    .subscribe((val) => {
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
