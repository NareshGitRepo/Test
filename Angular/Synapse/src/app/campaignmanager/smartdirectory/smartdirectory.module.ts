import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartDirectoryRoutes } from './smartdirectory.router';
import { AvatarModule } from 'ngx-avatar';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface }
  from 'ngx-perfect-scrollbar';
import { CreatesmartgroupComponent } from './createsmartgroup/createsmartgroup.component';
import { CreatesmartcontactComponent } from './createsmartcontact/createsmartcontact.component';
import { SmartdirectoryComponent } from './smartmanage/smartdirectory.component';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { GlobalFilterPipe, DepartementFilterPipe, UserFilterPipe } from './_pipe/_smartDirectoryFilter';
import { TranslateModule } from '@ngx-translate/core';
import { SmartDirectoryConfirmComponent } from './_model/smartdirectory.confirm';
import { UtilsModule } from '../../_utilities/UtilsModule';
import { FileHelpersModule } from 'ngx-file-helpers';
import { PapaParseModule } from 'ngx-papaparse';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SmartDirectoryRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    TranslateModule,
    PerfectScrollbarModule,
    sharedDirectiveModule,
    UtilsModule,
    MaterialModule,
    FileHelpersModule,
    PapaParseModule
  ],
  declarations: [SmartdirectoryComponent, CreatesmartgroupComponent, CreatesmartcontactComponent,
    UserFilterPipe, DepartementFilterPipe, GlobalFilterPipe, SmartDirectoryConfirmComponent],
  entryComponents: [CreatesmartgroupComponent, CreatesmartcontactComponent, SmartDirectoryConfirmComponent],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class SmartDirectoryModule { }
