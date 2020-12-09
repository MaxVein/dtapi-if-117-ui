import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResultsService } from '../results.service';

@Component({
    selector: 'app-details-by-question',
    templateUrl: './details-by-question.component.html',
    styleUrls: ['./details-by-question.component.scss'],
})
export class DetailsByQuestionComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private resultApi: ResultsService,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}
    dataSource;
    ngOnInit(): void {
        this.resultApi
            .getAnswersByQuestions(this.data.question_id)
            .subscribe((res) => (this.dataSource = res));
    }
}
