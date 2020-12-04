import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { StudentService } from './services/student.service';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    declarations: [StudentComponent],
    imports: [CommonModule, SharedModule, StudentRoutingModule, OverlayModule],
    providers: [StudentService],
})
export class StudentModule {}
