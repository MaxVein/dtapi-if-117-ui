import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { AdminModalCreationComponent } from '../admin-modals/admin-modal-creation/admin-modal-creation.component'
import { Admins, AdminsCreation } from '../admin-model/Admins'
import { AdminsCrudService } from '../admin-services/admins-crud.service'

@Component({
    selector: 'app-admins-template',
    templateUrl: './admins-template.component.html',
    styleUrls: ['./admins-template.component.scss'],
    providers: [AdminsCrudService],
})
export class AdminsTemplateComponent {
    displayedColumns: string[] = ['id', 'name', 'email', 'operations']
    dataSource: MatTableDataSource<Admins>

    creationData: AdminsCreation

    @ViewChild(MatPaginator) paginator: MatPaginator
    @ViewChild(MatSort) sort: MatSort

    constructor(
        private admincrud: AdminsCrudService,
        public dialog: MatDialog
    ) {
        this.admincrud.getAdmins().subscribe((admin) => {
            this.dataSource = new MatTableDataSource(admin)
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort
        })
    }
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }
    openModal(operationType: string, id?: string): void {
        let dialogRef
        switch (operationType) {
            case 'Add':
                dialogRef = this.dialog.open(AdminModalCreationComponent, {
                    width: '400px',
                    data: {
                        title: 'Додати адміна',
                    },
                })
                dialogRef.afterClosed().subscribe((result) => {
                    this.creationData = result
                    if (this.creationData) {
                        this.admincrud
                            .addAdmin(JSON.stringify(this.creationData))
                            .subscribe((res) => console.warn(res))
                    }
                })
                break
            case 'Update':
                dialogRef = this.dialog.open(AdminModalCreationComponent, {
                    width: '400px',
                    data: {
                        title: 'Редагувати адміна',
                    },
                })
                dialogRef.afterClosed().subscribe((result) => {
                    this.creationData = result
                    if (this.creationData) {
                        this.admincrud
                            .updateAdmin(JSON.stringify(this.creationData), id)
                            .subscribe((res) => console.warn(res))
                    }
                })
                break
        }
    }
    deleteAdminWithId(id: string): void {
        this.admincrud.deleteAdmin(id).subscribe((res) => alert(res))
    }
}
