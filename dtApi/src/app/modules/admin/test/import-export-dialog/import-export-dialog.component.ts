import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { mergeMap } from 'rxjs/operators';

import { ImportExportService } from './import-export.service';

export interface DialogData {
    test_id: string;
}
export interface Records {
    numberOfRecords: string;
}
export interface QuestionInstance {
    question_id: number;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
}

@Component({
    selector: 'app-import-export-dialog',
    templateUrl: './import-export-dialog.component.html',
    styleUrls: ['./import-export-dialog.component.scss'],
})
export class ImportExportDialogComponent implements OnInit {
    isExport = false;
    isImport = false;
    count: string;
    questions: [];
    questionsIds: [];
    testFullData: any = [];
    ieForm: FormGroup;
    file: any;
    fileData: any;

    constructor(
        public dialogRef: MatDialogRef<ImportExportDialogComponent>,
        private ieService: ImportExportService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.ieForm = new FormGroup({
            atachment: new FormControl(),
        });
    }
    exportTests() {
        this.isExport = true;
        this.ieService
            .getCount('question', this.data.test_id)
            .pipe(
                mergeMap((res: Records) => {
                    this.count = res.numberOfRecords;
                    return this.ieService
                        .getQuestions('question', this.data.test_id, this.count)
                        .pipe(
                            mergeMap((item) => {
                                this.questions = item;
                                this.questionsIds = item.map(
                                    (item) => item.question_id
                                );
                                const observables = this.questionsIds.map(
                                    (id) =>
                                        this.ieService.getAnswers('answer', id)
                                );
                                return forkJoin(observables);
                            })
                        );
                })
            )
            .subscribe((res) => {
                this.questions.forEach((item: QuestionInstance) => {
                    res.forEach((elem) => {
                        if (item.question_id === elem[0].question_id) {
                            this.testFullData.push({
                                ...item,
                                answers: elem,
                            });
                        }
                    });
                });
                let blob = new Blob(
                    [JSON.stringify(this.testFullData, null, 2)],
                    {
                        type: 'text/json',
                    }
                );

                let url = URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'data.json');
                link.click();
            });
    }
    importTests() {
        this.isImport = true;
    }
    fileUpload(e) {
        this.file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.fileData = JSON.parse(fileReader.result.toString());
        };
        fileReader.readAsText(this.file);
    }
}
