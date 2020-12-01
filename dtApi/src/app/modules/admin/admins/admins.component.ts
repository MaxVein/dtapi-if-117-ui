/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminModalCreationComponent } from './admin-modal-creation/admin-modal-creation.component';
import { DeleteConfirmModalComponent } from './delete-confirm-modal/delete-confirm-modal.component';
import { Admins } from './Admins';
import { AdminsCrudService } from './admins.service';

@Component({
    selector: 'app-admins',
    templateUrl: './admins.component.html',
    styleUrls: ['./admins.component.scss'],
    providers: [AdminsCrudService],
})
export class AdminsComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'name', 'email', 'operations'];
    dataSource: MatTableDataSource<Admins>;
    adminsArray: [] = [];
    subscribed = true;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private admincrud: AdminsCrudService,
        public dialog: MatDialog
    ) {}
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    addAdminModelOpen(): void {
        this.dialog
            .open(AdminModalCreationComponent, {
                data: {
                    title: 'Додати адміна',
                    user: {},
                },
            })
            .afterClosed()
            .subscribe((res) => {
                console.warn(res);
                // if (res !== undefined) {
                //     setTimeout(() => {
                //         if (res.user !== undefined) {
                //             this.dataSource = new MatTableDataSource(
                //                 this.adminsArray.concat(res.user)
                //             );
                //             this.dataSource.paginator = this.paginator;
                //             this.dataSource.sort = this.sort;
                //         }
                //     }, 500);
                // }
            });
    }
    updateAdminModelOpen(user: Admins): void {
        this.dialog
            .open(AdminModalCreationComponent, {
                data: {
                    title: 'Редагувати адміна',
                    user: {
                        userId: user.id,
                        username: user.username,
                        email: user.email,
                    },
                },
            })
            .afterClosed()
            .subscribe((res) => {
                console.warn(res);
                if (status === 'ok') {
                    setTimeout(() => {
                        if (res.newUser !== {}) {
                            const userIndex = this.dataSource.data.indexOf(
                                res.user
                            );
                            const oldUser = this.dataSource.data.find(
                                (item, index) => index === userIndex
                            );
                            for (const oldItem in oldUser) {
                                for (const newItem in res.newUser) {
                                    if (oldItem === newItem) {
                                        oldUser[oldItem] = res.newUser[newItem];
                                        this.dataSource.data = this.dataSource.data;
                                    }
                                }
                            }
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }
                    }, 500);
                }
            });
    }
    deleteAdminModelOpen(user: Admins): void {
        this.dialog
            .open(DeleteConfirmModalComponent, {
                data: {
                    title: 'Підтвердіть дію',
                    userId: user.id,
                },
            })
            .afterClosed()
            .subscribe((res) => {
                if (res === 'ok') {
                    const elementIndex = this.dataSource.data.indexOf(res.user);
                    this.dataSource.data.splice(elementIndex, 1);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            });
    }
    openModal(operationType: string, user?: Admins): void {
        switch (operationType) {
            case 'Add':
                this.addAdminModelOpen();
                break;
            case 'Update':
                this.updateAdminModelOpen(user);
                break;
            case 'Delete':
                this.deleteAdminModelOpen(user);
                break;
        }
    }
    ngOnInit(): void {
        this.admincrud.getAdmins().subscribe((admin) => {
            this.adminsArray = admin;
            this.dataSource = new MatTableDataSource(this.adminsArray);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
    ngOnDestroy(): void {}
}
