import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule
} from '@angular/material';

import { CommonModule } from '@angular/common';
import { DFormatTimePipe } from './_pipe/filterPipe';
import { EmpperformanceComponent } from './empperformancemanage/empperformance.component';
import { EmpperformanceRoutes } from './empperformance.router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// material modules


// forms module





@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmpperformanceRoutes),
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatListModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,MatSortModule,
    TranslateModule
  ],
  declarations: [EmpperformanceComponent, DFormatTimePipe],
  entryComponents: []
})
export class EmpperformanceModule { }
