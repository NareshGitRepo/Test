import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { AvatarModule } from 'ngx-avatar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ServiceTypeRoutes } from './servicetype.router';
import { ServiceTypecreateComponent } from './servicetypecreate/servicetypecreate.component';
import { ServiceTypeManageComponent } from './servicetypemanage/servicetypemanage.component';
import { ServiceTypePipe } from './_pipe/ServiceTypeFilterPipe';
import { ServiceTypeAlert } from './_model/serviceTypeAlert';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ServiceTypeRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    PerfectScrollbarModule,
    AvatarModule,
  ],
  declarations: [ServiceTypeManageComponent,ServiceTypecreateComponent,ServiceTypePipe,ServiceTypeAlert],
  entryComponents: [ServiceTypecreateComponent,ServiceTypeAlert]
})
export class ServiceTypeModule { }
