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
    group_name: string;
    speciality_name: string;
    faculty_name: string;

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
            console.log(data)
            data.map((item) => {
                this.groupsSertvice
                    .getData('Speciality',item.speciality_id)
                    .subscribe((data: any) => {
                        item.speciality_name = data[0].speciality_name
                    })
                this.groupsSertvice
                    .getData('Faculty',item.faculty_id)
                    .subscribe((data: any) => {
                        item.faculty_name = data[0].faculty_name
                    })
            })
            ELEMENT_DATA = data
            this.dataSource = new MatTableDataSource<GroupData>(
                ELEMENT_DATA
            )
        })
    }

    createGroup(): void {
        const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
            width: '350px',
        })

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result)
        })
    }
}
