import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { GroupsService } from './groups.service'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { CreateGroupDialogComponent } from './create-group-dialog/create-group-dialog.component'

export interface GroupData {
    group_id: string
    group_name: string
    speciality_id: string
    faculty_id: string
}

let ELEMENT_DATA: GroupData[] = []

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
    specialities: any = []
    faculties: any = []
    sharedData = []
    group_name: string
    speciality_name: string
    faculty_name: string

    displayedColumns: string[] = [
        'group_id',
        'group_name',
        'speciality_name',
        'faculty_name',
        'actions',
    ]
    dataSource = new MatTableDataSource<GroupData>()
    res = []
    constructor(
        private groupsSertvice: GroupsService,
        public dialog: MatDialog
    ) {}

    @ViewChild(MatPaginator) paginator: MatPaginator

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator
    }

    ngOnInit() {
        // this.groupsSertvice.logIn().subscribe((data: any[])=>{
        //   console.log(data);
        //   this.res = data;
        // })
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
            console.log(this.sharedData)
            this.sharedData
                ? this.groupsSertvice.saveData(this.sharedData)
                : false
        })
    }

    createGroup(): void {
        const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
            width: '300px',
            data: {
                group_name: this.group_name,
                speciality_name: this.speciality_name,
                faculty_name: this.faculty_name,
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
    addGroup(group) {
        this.groupsSertvice
            .insertData('Group', group)
            .subscribe((result: GroupData[]) => {
                this.dataSource.paginator = this.paginator
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
}
