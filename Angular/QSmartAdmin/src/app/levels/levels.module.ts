import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { LevelsRoutes } from './levels.router';
import { LevelsmanageComponent } from './levelsmanage/levelsmanage.component';
import { LevelscreateComponent } from './levelscreate/levelscreate.component';
import { DepartementscreateComponent } from './departementscreate/departementscreate.component';
import { AvatarModule } from 'ngx-avatar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LeveldetailsComponent } from './leveldetails/leveldetails.component';
import { DepartmentFilterPipe } from './_pipe/DepartmentFilterPipe';
import { LevelAlertComponent } from './_model/levelAlert';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LevelsRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    PerfectScrollbarModule,
    AvatarModule,
  ],
  declarations: [LevelsmanageComponent, LevelscreateComponent, DepartementscreateComponent, LeveldetailsComponent,
    DepartmentFilterPipe, LevelAlertComponent],
  entryComponents: [LevelscreateComponent, DepartementscreateComponent, LeveldetailsComponent, LevelAlertComponent]
})
export class LevelsModule { }
