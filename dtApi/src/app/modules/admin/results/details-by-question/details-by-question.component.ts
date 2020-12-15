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
        private resultApi: ResultsService,
        @Inject(MAT_DIALOG_DATA) public data?
    ) {}
    dataSource;
    ngOnInit(): void {
        this.resultApi
            .getAnswersByQuestions(this.data.question_id)
            .subscribe((res) => {
                this.dataSource = res;
            });
    }
    getAnswerText() {
        const more = this.dataSource.filter((item) => {
            return this.data.answer_ids.some((i) => i == item.answer_id);
        });
        if (!more.length) {
            if (!this.data.answer_ids[0]) {
                return 'Користувач не дав відповіді';
            }
            return this.data.answer_ids;
        }
        const toText = more.map((i) => i.answer_text).join(', ');

        return toText;
    }
}
