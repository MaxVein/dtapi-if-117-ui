import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import {MatSort} from '@angular/material/sort';

import { GroupsService } from './groups.service'
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component'
import { GroupDialogComponent } from './group-dialog/group-dialog.component'

export interface GroupData {
    group_id: string
    group_name: string
    speciality_id: string
    faculty_id: string
}

let ELEMENT_DATA: GroupData[]

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
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

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
    @ViewChild('table', { static: true }) table: MatTable<GroupData>
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    res = []
    constructor(
        private groupsSertvice: GroupsService,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.getGroups();
    }
    getGroups() {
        this.groupsSertvice.getData('Group').subscribe((data: any[]) => {
            data.map((item) => {
                this.groupsSertvice
                    .getData('Speciality', item.speciality_id)
                    .subscribe((data) => {
                        this.specialities.push({ ...data })
                        item.speciality_name = data[0].speciality_name
                    })
                this.groupsSertvice
                    .getData('Faculty', item.faculty_id)
                    .subscribe((data: any) => {
                        this.faculties.push({ ...data })
                        item.faculty_name = data[0].faculty_name
                    })
            })
            this.sharedData.push(this.specialities, this.faculties)
            ELEMENT_DATA = data
            this.dataSource = new MatTableDataSource<GroupData>(ELEMENT_DATA)
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort;

            this.sharedData
                ? this.groupsSertvice.saveData(this.sharedData)
                : false
        })
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
                        speciality_id: parseInt(
                            this.getSpecialityId(result.speciality_name),
                            10
                        ),
                        faculty_id: parseInt(
                            this.getFacultyId(result.faculty_name),
                            10
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
                        speciality_id: parseInt(
                            this.getSpecialityId(result.speciality_name),
                            10
                        ),
                        faculty_id: parseInt(
                            this.getFacultyId(result.faculty_name),
                            10
                        ),
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
            }
        })
    }
    addGroup(group) {
        this.groupsSertvice
            .insertData('Group', group)
            .subscribe((result: GroupData) => {
                this.dataSource.paginator = this.paginator
                this.dataSource.data.push(result[0])
                this.ngOnInit()
            })
    }
    editGroup(id, group) {
        this.groupsSertvice.updateData('Group', id, group).subscribe(() => {
            this.dataSource.data.map((item) => {
                item.group_id === id
                    ? (item = { group_id: id, ...group })
                    : false
            })
            this.ngOnInit()
        })
    }

    getSpecialityId(spec: string) {
        const currentSpec = this.specialities.filter(
            (item) => item[0].speciality_name === spec
        )
        return currentSpec[0][0].speciality_id
    }
    getFacultyId(spec: string) {
        const currentSpec = this.faculties.filter(
            (item) => item[0].faculty_name === spec
        )
        return currentSpec[0][0].faculty_id
    }
    delGroup(id) {
        this.groupsSertvice.delData('Group', id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
                (item) => (item.group_id! = id)
            )
            this.ngOnInit()
        })
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}
