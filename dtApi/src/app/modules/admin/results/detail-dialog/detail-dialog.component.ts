import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResultsService } from '../results.service';

@Component({
    selector: 'app-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
})
export class DetailDialogComponent implements OnInit {
    displayedColumns: string[] = ['id', 'textName'];
    constructor(
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
            },
        });
    }
}
