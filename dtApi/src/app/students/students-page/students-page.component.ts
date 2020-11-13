import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { StudentsService } from '../../shared/services/students/students.service'
import { Student } from '../../shared/interfaces/students/interfaces'
import { Subscription } from 'rxjs'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { StudentsModalComponent } from './students-modal/students-modal.component'

@Component({
    selector: 'app-students-page',
    templateUrl: './students-page.component.html',
    styleUrls: ['./students-page.component.scss'],
})
export class StudentsPageComponent implements OnInit, AfterViewInit, OnDestroy {
    loading = false
    isUpdateData = false
    studentSubscription: Subscription
    displayedColumns: string[] = [
        'index',
        'gradebookID',
        'studentInfo',
        'actions',
    ]
    dataSource = new MatTableDataSource<Student>()

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator

    constructor(
        private studentsService: StudentsService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loading = true
        this.getStudentsByGroup()
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }

    getStudentsByGroup(): void {
        this.studentSubscription = this.studentsService
            .getByGroup(1)
            .subscribe((response) => {
                this.dataSource.data = response
                this.loading = false
            })
    }

    add(): void {
        this.isUpdateData = false
        this.dialog.open(StudentsModalComponent, {
            data: {
                isUpdateData: this.isUpdateData,
            },
        })
    }

    edit(student: Student): void {
        this.isUpdateData = true
        this.dialog.open(StudentsModalComponent, {
            data: {
                isUpdateData: this.isUpdateData,
                student_data: student,
            },
        })
    }

    remove(id: string): void {
        const decision = window.confirm('Do you want to delete this student?')

        if (decision) {
            this.studentsService.remove(id).subscribe(() => {
                this.dataSource.data = this.dataSource.data.filter(
                    (s) => s.user_id !== id
                )
            })
        }
    }

    ngOnDestroy(): void {
        if (this.studentSubscription) {
            this.studentSubscription.unsubscribe()
        }
    }
}
