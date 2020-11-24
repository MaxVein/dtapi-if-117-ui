/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, ViewChild } from '@angular/core'
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
export class AdminsTemplateComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'email', 'operations']
    dataSource: MatTableDataSource<Admins>
    adminsArray: [] = []

    @ViewChild(MatPaginator) paginator: MatPaginator
    @ViewChild(MatSort) sort: MatSort

    constructor(
        private admincrud: AdminsCrudService,
        public dialog: MatDialog
    ) {}
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }
    openModal(operationType: string, user?: Admins): void {
        let dialog
        switch (operationType) {
            case 'Add':
                dialog = this.dialog.open(AdminModalCreationComponent, {
                    width: '300px',
                    data: {
                        title: 'Додати адміна',
                        user: {},
                    },
                })
                dialog.afterClosed().subscribe((res) => {
                    if (res !== undefined) {
                        setTimeout(() => {
                            if (res.user !== undefined) {
                                this.dataSource = new MatTableDataSource(
                                    this.adminsArray.concat(res.user)
                                )
                                this.dataSource.paginator = this.paginator
                                this.dataSource.sort = this.sort
                            }
                        }, 500)
                    }
                })
                break
            case 'Update':
                dialog = this.dialog.open(AdminModalCreationComponent, {
                    width: '300px',
                    data: {
                        title: 'Редагувати адміна',
                        user: user,
                        newUser: {},
                    },
                })
                dialog.afterClosed().subscribe((res) => {
                    if (res !== undefined) {
                        setTimeout(() => {
                            if (res.newUser !== {}) {
                                const userIndex = this.dataSource.data.indexOf(
                                    res.user
                                )
                                const oldUser = this.dataSource.data.find(
                                    (item, index) => index === userIndex
                                )
                                for (const oldItem in oldUser) {
                                    for (const newItem in res.newUser) {
                                        if (oldItem === newItem) {
                                            oldUser[oldItem] =
                                                res.newUser[newItem]
                                            this.dataSource.data = this.dataSource.data
                                        }
                                    }
                                }
                                this.dataSource.paginator = this.paginator
                                this.dataSource.sort = this.sort
                            }
                        }, 500)
                    }
                })
                break
            case 'Delete':
                dialog = this.dialog.open(DeleteConfirmModalComponent, {
                    width: '300px',
                    data: {
                        title: 'Підтвердіть дію',
                        user: user,
                    },
                })
                dialog.afterClosed().subscribe((res) => {
                    if (res !== undefined) {
                        const elementIndex = this.dataSource.data.indexOf(
                            res.user
                        )
                        this.dataSource.data.splice(elementIndex, 1)
                        this.dataSource.data = this.dataSource.data
                        this.dataSource.paginator = this.paginator
                        this.dataSource.sort = this.sort
                    }
                })
                break
        }
    }
    ngOnInit(): void {
        this.admincrud.getAdmins().subscribe((admin) => {
            this.adminsArray = admin
            this.dataSource = new MatTableDataSource(this.adminsArray)
            this.dataSource.paginator = this.paginator
            this.dataSource.sort = this.sort
        })
    }
}
