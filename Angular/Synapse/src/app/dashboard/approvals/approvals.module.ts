import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule }
  from 'ngx-perfect-scrollbar';
import { ApprovalsconfirmComponent } from './confirm/approvalsconfirm.component';
import { ApprovalspageComponent } from './manage/approvals.component';
import { ApprovalspageRoutes } from './approvals.router';
import { CommonModule } from '@angular/common';
import { ConfirmApprovalComponent } from './_model/approvalAlert';
import { ConfirmcampaignComponent } from './confirmcampaign/confirmcampaign.component';
import { ConfirmcustomerComponent } from './confirmcustomer/confirmcustomer.component';
import { ConfirmdepartmentComponent } from './confirmdepartment/confirmdepartment.component';
import { ConfirmdeptquotaComponent } from './confirmdeptquota/confirmdeptquota.component';
import { ConfirmgroupComponent } from './confirmgroup/confirmgroup.component';
import { ConfirminterfaceComponent } from './confirminterface/confirminterface.component';
import { ConfirmsegmentComponent } from './confirmsegment/confirmsegment.component';
import { ConfirmsenderComponent } from './confirmsender/confirmsender.component';
import { ConfirmserviceComponent } from './confirmservice/confirmservice.component';
import { ConfirmspamComponent } from './confirmspam/confirmspam.component';
import { ConfirmtemplateComponent } from './confirmtemplate/confirmtemplate.component';
import { ConfirmuserComponent } from './confirmuser/confirmuser.component';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { ConfirmofflinealertsComponent } from './confirmofflinealerts/confirmofflinealerts.component';
import { ConfirmalertmanagerComponent } from './confirmalertmanager/confirmalertmanager.component';
import { ConfirmsmstoemailComponent } from './confirmsmstoemail/confirmsmstoemail.component';
import { ConfirmmailserverComponent } from './confirmmailserver/confirmmailserver.component';
import { ConfirmemailtosmsComponent } from './confirmemailtosms/confirmemailtosms.component';
import { ConfirmemailtemplateComponent } from './confirmemailtemplate/confirmemailtemplate.component';
import { ConfirmsetnotificationComponent } from './confirmsetnotification/confirmsetnotification.component';


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
    MaterialModule,
    FileUploadModule,
    TruncateModule,
    sharedDirectiveModule,
    RouterModule.forChild(ApprovalspageRoutes),
    TranslateModule
  ],
  declarations: [
    ApprovalspageComponent,
    ApprovalsconfirmComponent,
    ConfirmApprovalComponent,
    ConfirmuserComponent,
    ConfirmserviceComponent,
    ConfirmsegmentComponent,
    ConfirminterfaceComponent,
    ConfirmgroupComponent,
    ConfirmdepartmentComponent,
    ConfirmcustomerComponent,
    ConfirmdeptquotaComponent,
    ConfirmtemplateComponent,
    ConfirmsenderComponent,
    ConfirmcampaignComponent,
    ConfirmspamComponent,
    ConfirmofflinealertsComponent,
    ConfirmalertmanagerComponent,
    ConfirmsmstoemailComponent,
    ConfirmmailserverComponent,
    ConfirmemailtosmsComponent,
    ConfirmemailtemplateComponent,
    ConfirmsetnotificationComponent 
  
  ],
  entryComponents: [ConfirmalertmanagerComponent,ConfirmofflinealertsComponent,ConfirmdepartmentComponent, ConfirmgroupComponent, ConfirminterfaceComponent,
    ConfirmsegmentComponent, ConfirmApprovalComponent, ApprovalsconfirmComponent,
    ConfirmuserComponent, ConfirmserviceComponent, ConfirmcustomerComponent, ConfirmdeptquotaComponent,
    ConfirmtemplateComponent, ConfirmsenderComponent, ConfirmcampaignComponent, ConfirmspamComponent,ConfirmsmstoemailComponent, ConfirmmailserverComponent, ConfirmemailtosmsComponent, ConfirmemailtemplateComponent,
    ConfirmsetnotificationComponent ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },

  ]
})
export class ApprovalspageModule { }
