import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SmscampaignComponent } from './manage/smscampaign.component';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface }
  from 'ngx-perfect-scrollbar';
import { AvatarModule } from 'ngx-avatar';
import { CampaignFilterPipe, MessageLimitPipe, CampaignMessgaeReplacePipe } from './_pipe/campaignFilter';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
import { CreatemtComponent } from './create/createmt.component';
import { PapaParseModule } from 'ngx-papaparse';
import { ConfirmDeleteComponent } from './delete/confirmdelete.component';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { CampaignRoutes } from './campaigns.router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../_shared/material.module';
import { CampaigndetailsComponent } from './details/campaigndetails.component';
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
    TranslateModule,
    RouterModule.forChild(CampaignRoutes),
    AvatarModule,
    PapaParseModule,
    sharedDirectiveModule,
    MaterialModule
  ],
  declarations: [
    CampaignFilterPipe,
    CampaignMessgaeReplacePipe,
    CreatemtComponent,
    ConfirmDeleteComponent,
    SmscampaignComponent,
    MessageLimitPipe,
    CampaigndetailsComponent
  ],
  entryComponents: [
    ConfirmDeleteComponent, CreatemtComponent,CampaigndetailsComponent],
  providers: [
    DatePipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }]
})
export class CampaignsModule { }