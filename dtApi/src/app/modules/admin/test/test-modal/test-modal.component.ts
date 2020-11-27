import { Component, OnInit, Inject } from '@angular/core';

import { Subject } from '../models/Subject';
import { DialogData } from '../models/DialogData';
import { TestService } from '../services/test.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-test-modal',
    templateUrl: './test-modal.component.html',
    styleUrls: ['./test-modal.component.scss'],
})
export class TestModalComponent implements OnInit {
    subjects: Subject[] = [];

    constructor(
        private testService: TestService,
        public dialogRef: MatDialogRef<TestModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        this.testService.getEntity('subject').subscribe((result: Subject[]) => {
            this.subjects = result;
        });
    }
}
