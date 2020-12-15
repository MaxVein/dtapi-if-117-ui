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
export class AdminsComponent implements OnInit {
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
                },
            })
            .afterClosed()
            .subscribe((res) => {
                if (res) {
                    if (res.finished) {
                        this.dataSource.data = this.dataSource.data.concat(
                            res.user
                        );
                        this.dataSource._updateChangeSubscription();
                        this.dataSource.paginator = this.paginator;
                    }
                }
            });
    }
    updateAdminModelOpen(user: Admins): void {
        this.dialog
            .open(AdminModalCreationComponent, {
                data: {
                    title: 'Редагувати адміна',
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                },
            })
            .afterClosed()
            .subscribe((res) => {
                if (!res || !res.finished) return null;
                const oldIndex = this.dataSource.data.findIndex(
                    (item) => item === user
                );
                this.dataSource.data = this.dataSource.data.map(
                    (curUser: any, curIndex) => {
                        return curIndex === oldIndex
                            ? (curUser = res.user)
                            : curUser;
                    }
                );
            });
    }
    deleteAdminModelOpen(user: Admins): void {
        this.dialog
            .open(DeleteConfirmModalComponent, {
                data: {
                    title: 'Підтвердіть дію',
                    user: user,
                },
            })
            .afterClosed()
            .subscribe((res) => {
                if (!res) return;
                if (res.finished) {
                    this.dataSource.data.splice(
                        this.dataSource.data.indexOf(res.user),
                        1
                    );
                    this.dataSource._updateChangeSubscription();
                    this.dataSource.paginator = this.paginator;
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
}
