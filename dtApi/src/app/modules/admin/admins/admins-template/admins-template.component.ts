/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { AdminModalCreationComponent } from '../admin-modals/admin-modal-creation/admin-modal-creation.component'
import { DeleteConfirmModalComponent } from '../admin-modals/delete-confirm-modal/delete-confirm-modal.component'
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
    openModal(operationType: string, user?: AdminsCreation): void {
        switch (operationType) {
            case 'Add':
                this.dialog.open(AdminModalCreationComponent, {
                    width: '300px',
                    data: {
                        title: 'Додати адміна',
                    },
                })
                break
            case 'Update':
                this.dialog.open(AdminModalCreationComponent, {
                    width: '300px',
                    data: {
                        title: 'Редагувати адміна',
                        user: user,
                    },
                })
                break
            case 'Delete':
                this.dialog.open(DeleteConfirmModalComponent, {
                    width: '300px',
                    data: {
                        title: 'Підтвердіть дію',
                        user: user,
                    },
                })
        }
    }
}
