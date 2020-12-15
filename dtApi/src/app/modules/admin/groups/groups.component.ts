import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

import { GroupsService } from './groups.service';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { GroupData, AddGroupData, ServiceResponse } from './groups.interfaces';

let ELEMENT_DATA: GroupData[];

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, AfterViewInit {
    loading: boolean;
    specialities: Array<{
        speciality_id: string;
        speciality_name: string;
        speciality_code: string;
    }>;
    faculties: Array<{
        faculty_id: string;
        faculty_name: string;
        faculty_code: string;
    }>;
    sharedData: any = [];
    group_name: string;
    speciality_name: string;
    faculty_name: string;
    group_id: string;

    displayedColumns: string[] = [
        'group_id',
        'group_name',
        'speciality_name',
        'faculty_name',
        'actions',
    ];
    dataSource = new MatTableDataSource<GroupData>(ELEMENT_DATA);
    groupsSubscription: Subscription;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    res = [];

    constructor(
        private groupsSertvice: GroupsService,
        public dialog: MatDialog,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.getGroups();
    }

    ngAfterViewInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Рядків у таблиці';
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private getGroups(): void {
        this.groupsSubscription = forkJoin({
            groups: this.groupsSertvice.getData('Group'),
            faculties: this.groupsSertvice.getData('Faculty'),
            specialities: this.groupsSertvice.getData('Speciality'),
        }).subscribe((res: ServiceResponse) => {
            this.specialities = res.specialities;
            this.faculties = res.faculties;
            const newData = this.genereteTableData(res.groups);
            this.sharedData.push(this.specialities, this.faculties);
            this.dataSource = new MatTableDataSource<GroupData>(newData);
            this.sharedData
                ? this.groupsSertvice.saveData(this.sharedData)
                : false;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
        this.loading = false;
        this.groupsSertvice.snackBarOpen('Групи завантажено');
    }

    changeGroup(group?: GroupData): void {
        group ? this.editGroupModal(group) : this.addGroupModal();
    }

    delCurrGroup(group: GroupData): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: group.group_name,
            },
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.delGroup(group.group_id);
            } else {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }

    addGroup(group: AddGroupData) {
        this.groupsSubscription = this.groupsSertvice
            .insertData('Group', group)
            .subscribe(
                (result: GroupData) => {
                    result = {
                        ...result[0],
                        speciality_name: this.getSpecParam(
                            result[0].speciality_id,
                            'speciality_id'
                        ),
                        faculty_name: this.getFacParam(
                            result[0].faculty_id,
                            'faculty_id'
                        ),
                    };
                    this.dataSource.data = this.dataSource.data.concat(result);
                    this.dataSource.paginator.lastPage();
                    this.dataSource.sort = this.sort;
                    this.groupsSertvice.snackBarOpen('Групу додано');
                },
                (error) => {
                    this.groupsSertvice.snackBarOpen(
                        'Можливо така група вже існує'
                    );
                    this.loading = false;
                }
            );
    }

    editGroup(id: string, group) {
        this.groupsSubscription = this.groupsSertvice
            .updateData('Group', id, group)
            .subscribe(
                (res) => {
                    const newSourse = this.dataSource.data.map((item) => {
                        if (item.group_id === id) {
                            return (item = {
                                ...res[0],
                                speciality_name: this.getSpecParam(
                                    res[0].speciality_id,
                                    'speciality_id'
                                ),
                                faculty_name: this.getFacParam(
                                    res[0].faculty_id,
                                    'faculty_id'
                                ),
                            });
                        } else {
                            return item;
                        }
                    });
                    this.dataSource.data = newSourse;
                    this.groupsSertvice.snackBarOpen('Групу відредаговано');
                },
                (error) => {
                    this.groupsSertvice.snackBarOpen(
                        'Можливо така група вже існує'
                    );
                }
            );
    }

    getSpecParam(param: string, field: string) {
        if (field === 'speciality_name') {
            const currentSpec = this.specialities.filter(
                (item) => item.speciality_name === param
            );
            return currentSpec[0].speciality_id;
        } else {
            const currentSpec = this.specialities.filter(
                (item) => item.speciality_id === param
            );
            return currentSpec[0].speciality_name;
        }
    }

    getFacParam(param: string, field: string) {
        if (field === 'faculty_name') {
            const currentSpec = this.faculties.filter(
                (item) => item.faculty_name === param
            );
            return currentSpec[0].faculty_id;
        } else {
            const currentSpec = this.faculties.filter(
                (item) => item.faculty_id === param
            );
            return currentSpec[0].faculty_name;
        }
    }

    delGroup(id: string) {
        this.groupsSubscription = this.groupsSertvice
            .delData('Group', id)
            .subscribe(
                () => {
                    this.dataSource.data = this.dataSource.data.filter(
                        (item) => item.group_id !== id
                    );
                    this.groupsSertvice.snackBarOpen('Групу видалено');
                    this.dataSource.data = this.dataSource.data;
                },
                () => {
                    this.groupsSertvice.snackBarOpen(
                        'Спочатку видаліть студентів'
                    );
                }
            );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    goToStudents(id: string, groupName: string): void {
        const navigationExtras: NavigationExtras = {
            state: {
                groupName: groupName,
                id: id,
            },
        };
        this.router.navigate(['admin/group/students/'], navigationExtras);
    }

    genereteTableData(data: Array<GroupData>) {
        const newData = data;
        newData.map((item) => {
            this.specialities.map((elem) => {
                if (item.speciality_id === elem.speciality_id) {
                    item.speciality_name = elem.speciality_name;
                }
            });
            this.faculties.map((elem) => {
                if (item.faculty_id === elem.faculty_id) {
                    item.faculty_name = elem.faculty_name;
                }
            });
        });
        return newData;
    }

    editGroupModal(group: GroupData) {
        const dialogRef = this.dialog.open(GroupDialogComponent, {
            width: '300px',
            data: {
                group_id: group.group_id,
                group_name: group.group_name,
                speciality_name: group.speciality_name,
                faculty_name: group.faculty_name,
                type: 'edit',
            },
        });
        dialogRef.afterClosed().subscribe((result: GroupData) => {
            if (result) {
                this.editGroup(group.group_id, {
                    group_name: result.group_name,
                    speciality_id: this.getSpecParam(
                        result.speciality_name,
                        'speciality_name'
                    ),
                    faculty_id: this.getFacParam(
                        result.faculty_name,
                        'faculty_name'
                    ),
                });
            }
        });
    }

    addGroupModal() {
        const dialogRef = this.dialog.open(GroupDialogComponent, {
            width: '300px',
            data: {
                type: 'add',
            },
        });
        dialogRef.afterClosed().subscribe((result: GroupData) => {
            if (result) {
                this.addGroup({
                    group_name: result.group_name,
                    speciality_id: this.getSpecParam(
                        result.speciality_name,
                        'speciality_name'
                    ),
                    faculty_id: this.getFacParam(
                        result.faculty_name,
                        'faculty_name'
                    ),
                });
            }
        });
    }
    ngOnDestroy(): void {
        if (this.groupsSubscription) {
            this.groupsSubscription.unsubscribe();
        }
    }
}
