import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { DetailDialogComponent } from './detail-dialog/detail-dialog.component';
import { ResultsService } from './results.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
    constructor(
        private resultService: ResultsService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {}
    displayedColumns: string[] = [
        'id',
        'fullName',
        'rating',
        'data',
        'startTime',
        'duration',
        'statistic',
    ];
    groupId;
    testId;
    groupList;
    testsListByGroup;
    testsList = null;
    studentsResultsByGroup;
    testResults;
    dataSource = new MatTableDataSource();
    form: FormGroup;

    ngOnInit(): void {
        this.getGroupAndTestInfo();
        this.formInitialize();
    }
    private getGroupAndTestInfo() {
        this.resultService.getGroupList().subscribe({
            next: (res) => {
                this.groupList = res;
            },
        });

        this.resultService.getTestsList().subscribe({
            next: (res) => {
                this.testsListByGroup = res;
            },
        });
    }
    onChange($event) {
        this.resultService.getResultTestIdsByGroup($event.value).subscribe({
            next: (res: any) => {
                this.filteredTestOptions(res, $event);
            },
        });
    }
    onSubmit() {
        if (this.form.get('testName').value) {
            forkJoin([
                this.resultService.getStudentInfo(this.groupId),
                this.resultService.getRecordsByTestDate(
                    this.testId,
                    this.groupId
                ),
            ]).subscribe({
                next: ([groupRes, testRes]) => {
                    this.getTestInfoByGroup(groupRes, testRes);
                },
            });
        }
    }

    onChangeTest($event) {
        if ($event.value) {
            this.testId = $event.value;
        }
    }
    private filteredTestOptions(res, $event) {
        if (res.response) {
            this.testsList = null;
            this.form.get('testName').reset();
            this.resultService.snackBarOpen();
        } else {
            this.form.get('testName').reset();
            this.groupId = $event.value;
            this.testsList = this.testsListByGroup.filter((i) =>
                res.some((j) => j.test_id === i.test_id)
            );
        }
    }
    private getTestInfoByGroup(groupRes, testRes) {
        this.testResults = testRes;
        this.studentsResultsByGroup = groupRes;
        this.dataSource.data = this.testResults.map((item) => {
            const duration = this.resultService.getDuration(
                item.session_date,
                item.start_time,
                item.end_time
            );

            const studentInfo = this.studentsResultsByGroup.filter(
                (data) => data.user_id === item.student_id
            );
            return Object.assign({}, item, ...studentInfo, {
                duration,
            });
        });
    }

    private formInitialize() {
        this.form = this.formBuilder.group({
            testName: ['', [Validators.required]],
            groupName: ['', [Validators.required]],
        });
    }

    onClick(data) {
        this.dialog.open(DetailDialogComponent, {
            data,
            panelClass: 'custom-dialog-container',
            disableClose: true,
            maxHeight: '90vh',
        });
    }
}
