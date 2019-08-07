import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InterfacesRoutes } from './interfaces.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface }
  from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
import { CreateinterfaceComponent } from './create/createinterface.component';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { SortInterfacesPipe } from './_pipes/interfaces.sorting';
import { InterfacesFilterPipe } from './_pipes/userFilterPipe';
import { InterfacesComponent } from './manage/interfaces.component';
import { ConfirmInterfaceComponent } from './_model/interfaceconfirm';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../_shared/material.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    FormsModule,
    FileHelpersModule,
    FileUploadModule,
    TruncateModule,
    RouterModule.forChild(InterfacesRoutes),
    sharedDirectiveModule,
    TranslateModule,
    MaterialModule
  ],
  declarations: [
    InterfacesComponent, CreateinterfaceComponent, SortInterfacesPipe, InterfacesFilterPipe, ConfirmInterfaceComponent
  ],
  entryComponents: [CreateinterfaceComponent, ConfirmInterfaceComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ]
})
export class InterfacesModule { }
