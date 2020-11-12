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

export interface PeriodicElement {
    group_id: string
    group_name: string
    speciality_id: string
    faculty_id: string
}

let ELEMENT_DATA: PeriodicElement[] = []

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
    group_name: string
    displayedColumns: string[] = [
        'group_id',
        'group_name',
        'speciality_name',
        'faculty_name',
        'actions',
    ]
    dataSource = new MatTableDataSource<PeriodicElement>()
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
        this.groupsSertvice.getData().subscribe((data: any[]) => {
            console.log(data)
            data.map((item) => {
                this.groupsSertvice
                    .getSpec(item.speciality_id)
                    .subscribe((data: any) => {
                        item.speciality_name = data[0].speciality_name
                    })
                this.groupsSertvice
                    .getFac(item.faculty_id)
                    .subscribe((data: any) => {
                        item.faculty_name = data[0].faculty_name
                    })
            })
            ELEMENT_DATA = data
            this.dataSource = new MatTableDataSource<PeriodicElement>(
                ELEMENT_DATA
            )
        })
    }

    createGroup(): void {
        const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
            width: '350px',
            data: { group_name: this.group_name },
        })

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result)
            this.group_name = result
        })
    }
}
