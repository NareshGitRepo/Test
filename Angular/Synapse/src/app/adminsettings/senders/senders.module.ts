import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface }
  from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { senderrouts } from './senders.router';
import { CreatesendersComponent } from './create/createsenders.component';
import { SendersComponent } from './manage/senders.component';
import { Confirmsendercomponent } from './model/sender.confirm';
import { Senderfilterpipe } from './pipes/userFilterpipe';
import { MaterialModule } from '../../_shared/material.module';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { TranslateModule } from '@ngx-translate/core';

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
    TruncateModule,
    RouterModule.forChild(senderrouts),
    MaterialModule,
    sharedDirectiveModule,
    TranslateModule

  ],
  declarations: [CreatesendersComponent, SendersComponent, Confirmsendercomponent, Senderfilterpipe
  ],
  entryComponents: [CreatesendersComponent, Confirmsendercomponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },

  ]
})
export class SenderModule { }
