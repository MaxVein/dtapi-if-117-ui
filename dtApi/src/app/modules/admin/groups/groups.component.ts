import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { MatSort } from '@angular/material/sort'
import { Router } from '@angular/router'

import { GroupsService } from './groups.service'
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component'
import { GroupDialogComponent } from './group-dialog/group-dialog.component'

export interface GroupData {
    group_id: string
    group_name: string
    speciality_name: any
    faculty_name: any
}

let ELEMENT_DATA: GroupData[]

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
    loading: boolean
    specialities: any = []
    faculties: any = []
    sharedData: any = []
    group_name: string
    speciality_name: string
    faculty_name: string
    group_id: string

    displayedColumns: string[] = [
        'group_id',
        'group_name',
        'speciality_name',
        'faculty_name',
        'actions',
    ]
    dataSource = new MatTableDataSource<GroupData>(ELEMENT_DATA)

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
    @ViewChild('table', { static: false }) table: MatTable<GroupData>
    @ViewChild(MatSort, { static: false }) sort: MatSort

    res = []
    constructor(
        private groupsSertvice: GroupsService,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit() {
        this.loading = true
        this.getGroups()
    }
    getGroups() {
        this.groupsSertvice.getData('Group').subscribe((data: any[]) => {
            this.groupsSertvice
                .getData('Speciality')
                .subscribe((specialities) => {
                    specialities.map((speciality) => {
                        this.specialities.push(speciality)
                        data.map((item) => {
                            if (
                                item.speciality_id === speciality.speciality_id
                            ) {
                                item.speciality_name =
                                    speciality.speciality_name
                            }
                        })
                    })
                })
            this.groupsSertvice.getData('Faculty').subscribe((faculties) => {
                faculties.map((faculty) => {
                    this.faculties.push(faculty)
                    data.map((item) => {
                        if (item.faculty_id === faculty.faculty_id) {
                            item.faculty_name = faculty.faculty_name
                        }
                    })
                })
            })

            this.sharedData.push(this.specialities, this.faculties)
            ELEMENT_DATA = data
            this.dataSource = new MatTableDataSource<GroupData>(ELEMENT_DATA)

            this.sharedData
                ? this.groupsSertvice.saveData(this.sharedData)
                : false
        })
        this.loading = false
        setTimeout(() => {
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort
        })
        this.groupsSertvice.snackBarOpen('Групи завантажено')
    }

    changeGroup(group?): void {
        if (group) {
            const dialogRef = this.dialog.open(GroupDialogComponent, {
                width: '300px',
                data: {
                    group_id: group.group_id,
                    group_name: group.group_name,
                    speciality_name: group.speciality_name,
                    faculty_name: group.faculty_name,
                    type: 'edit',
                },
            })
            dialogRef.afterClosed().subscribe((result) => {
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
                    })
                }
            })
        } else {
            const dialogRef = this.dialog.open(GroupDialogComponent, {
                width: '300px',
                data: {
                    group_name: this.group_name,
                    speciality_name: this.speciality_name,
                    faculty_name: this.faculty_name,
                    type: 'add',
                },
            })
            dialogRef.afterClosed().subscribe((result) => {
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
                    })
                } else {
                    setTimeout(() => {
                        this.dataSource.paginator = this.paginator
                        this.dataSource.sort = this.sort
                    })
                }
            })
        }
    }

    delCurrGroup(group): void {
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            width: '300px',
            data: {
                group_name: group.group_name,
            },
        })
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delGroup(group.group_id)
            } else {
                setTimeout(() => {
                    this.dataSource.paginator = this.paginator
                    this.dataSource.sort = this.sort
                })
            }
        })
    }
    addGroup(group) {
        this.groupsSertvice.insertData('Group', group).subscribe(
            (result: any) => {
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
                }
                this.dataSource.data.push(result)
                this.dataSource.data = this.dataSource.data
                this.groupsSertvice.snackBarOpen('Групу додано')
            },
            (error) => {
                this.groupsSertvice.snackBarOpen('Можливо така група вже існує')
                this.loading = false
            }
        )
    }
    editGroup(id, group) {
        this.groupsSertvice.updateData('Group', id, group).subscribe(
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
                        })
                    } else {
                        return item
                    }
                })
                this.dataSource.data = newSourse
                this.dataSource.data = this.dataSource.data

                this.groupsSertvice.snackBarOpen('Групу відредаговано')
            },
            (error) => {
                this.groupsSertvice.snackBarOpen('Можливо така група вже існує')
            }
        )
    }
    getSpecParam(param: string, field: string) {
        if (field === 'speciality_name') {
            const currentSpec = this.specialities.filter(
                (item) => item.speciality_name === param
            )
            return currentSpec[0].speciality_id
        } else {
            const currentSpec = this.specialities.filter(
                (item) => item.speciality_id === param
            )
            return currentSpec[0].speciality_name
        }
    }
    getFacParam(param: string, field: string) {
        if (field === 'faculty_name') {
            const currentSpec = this.faculties.filter(
                (item) => item.faculty_name === param
            )
            return currentSpec[0].faculty_id
        } else {
            const currentSpec = this.faculties.filter(
                (item) => item.faculty_id === param
            )
            return currentSpec[0].faculty_name
        }
    }
    delGroup(id) {
        this.groupsSertvice.delData('Group', id).subscribe(
            (res) => {
                this.dataSource.data = this.dataSource.data.filter(
                    (item) => item.group_id !== id
                )
                this.groupsSertvice.snackBarOpen('Групу видалено')
                this.dataSource.data = this.dataSource.data
            },
            (error) => {
                this.groupsSertvice.snackBarOpen('Спочатку видаліть студентів')
            }
        )
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()
    }
    goToStudents(id: string, groupName: string) {
        this.router.navigate(['admin/group/students/', id], {
            queryParams: {
                groupName: groupName,
            },
        })
    }
}
