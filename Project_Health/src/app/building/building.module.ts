import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BuildingmanageComponent } from './buildingmanage/buildingmanage.component';
import { BuildingRoutes } from './building.router';
import { AvatarModule } from '../../../node_modules/ngx-avatar';
import { BuildingcreateComponent } from './buildingcreate/buildingcreate.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BuildingRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    PerfectScrollbarModule,
    AvatarModule,
  ],
  declarations: [BuildingmanageComponent, BuildingcreateComponent],
  entryComponents: [BuildingcreateComponent]
})
export class BuildingModule { }
