import { Component, OnInit, Inject } from '@angular/core';

import { DialogData, Subject } from '../test.interfaces';

import { TestService } from '../services/test.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-test-modal',
    templateUrl: './test-modal.component.html',
    styleUrls: ['./test-modal.component.scss'],
})
export class TestModalComponent implements OnInit {
    subjects: Subject[] = [];
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private testService: TestService,
        public dialogRef: MatDialogRef<TestModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            test_name: [
                this.data ? this.data.data.test_name : '',
                [Validators.required],
            ],
            subject_id: [
                this.data ? this.data.data.subject_id : '',
                [Validators.required],
            ],
            tasks: [
                this.data ? this.data.data.tasks : '',
                [Validators.required],
            ],
            time_for_test: [
                this.data ? this.data.data.time_for_test : '',
                [Validators.required],
            ],
            attempts: [
                this.data ? this.data.data.attempts : '',
                [Validators.required],
            ],
            enabled: [
                this.data ? this.data.data.enabled : '',
                [Validators.required],
            ],
        });
        this.testService.getEntity('subject').subscribe((result: Subject[]) => {
            this.subjects = result;
        });
    }
    sendTest() {
        this.dialogRef.close(this.form.value);
    }
}
