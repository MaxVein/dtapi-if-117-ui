import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';

import { StudentComponent } from './student.component';

import { ProfileService } from './services/profile.service';
import { TestPlayerService } from './services/test-player.service';

@NgModule({
    declarations: [StudentComponent],
    imports: [CommonModule, SharedModule, StudentRoutingModule],
    providers: [ProfileService, TestPlayerService],
})
export class StudentModule {}
