import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsByQuestionComponent } from '../details-by-question/details-by-question.component';
import { ResultsService } from '../results.service';

@Component({
    selector: 'app-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
})
export class DetailDialogComponent implements OnInit {
    displayedColumns: string[] = ['id', 'textName', 'answer', 'details'];
    constructor(
        private dialog: MatDialog,
        private resService: ResultsService,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}
    ids: any;
    questionsList;
    dataSource = new MatTableDataSource();
    ngOnInit(): void {
        this.dataSource.data = JSON.parse(this.data.questions);

        this.ids = this.dataSource.data.map((i) => {
            return i['question_id'];
        });
        this.resService.getByEntityManager('Question', this.ids).subscribe({
            next: (res) => {
                this.questionsList = res;
                this.dataSource.data = this.questionsList.map((item) => {
                    const studentInfo = JSON.parse(
                        this.data.true_answers
                    ).filter((data) => data.question_id === item.question_id);
                    return Object.assign({}, item, ...studentInfo);
                });
            },
        });
    }
    detailByQuestion(data) {
        this.dialog.open(DetailsByQuestionComponent, {
            data,
            panelClass: 'custom-dialog-container',
            maxHeight: '90vh',
            width: '1000px',
        });
    }
}
