import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityFilterPipe } from './_pipe/utilityFilter';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';
import { AvatarModule } from 'ngx-avatar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SenderFilterPipe } from './_pipe/SenderFilter';
import { SimpleSMSComponent } from './simplesms/simplesms.component';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    AvatarModule,
    DndModule.forRoot(),
    AmazingTimePickerModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [UtilityFilterPipe, SenderFilterPipe, SimpleSMSComponent],
  entryComponents: [SimpleSMSComponent],
  exports: [SimpleSMSComponent]

})
export class UtilsModule { }
