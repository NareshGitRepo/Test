import { Routes } from '@angular/router';

import { SigninComponent } from './login/signin/signin.component';
import { SignupComponent } from './login/signup/signup.component';
import { ChangepasswordComponent } from './login/changepassword/manage/changepassword.component';
import { AdminLayoutComponent,AuthLayoutComponent } from './core';

export const AppRoutes: Routes = [
  {
    path: '',
    component: SigninComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: 'dashboard',
      loadChildren: './dashboard/dashboard/dashboard.module#DashboardModule'
      // loadChildren: './dashboard/staticdashboard/staticdashboard.module#StaticDashboardModule'
    },
    {
      path: 'approval',
      loadChildren: './dashboard/approvals/approvals.module#ApprovalspageModule'
    },
    {
      path: 'profile',
      loadChildren: './profile/profile.module#ProfileModule'
    },
    {
      path: 'privileges',
      loadChildren: "./adminsettings/privileges/privileges.module#PrivilegesModule"
    },
    {
      path: 'users',
      loadChildren: './usermanagement/user/user.module#UserModule'
    },
    {
      path: 'sender',
      loadChildren: "./adminsettings/senders/senders.module#SenderModule"
    },
    {
      path: 'department',
      loadChildren: "./usermanagement/department/department.module#DepartmentModule"
    },
    {
      path: 'groups',
      loadChildren: "./usermanagement/groups/groupmanagement.module#GroupManagementModule"
    },
    {
      path: 'privileges',
      loadChildren: "./adminsettings/prioritization/prioritization.module#PrioritizationModule"
    },
    {
      path: 'interfaces',
      loadChildren: "./adminsettings/interfaces/interfaces.module#InterfacesModule"
    },
    {
      path: 'service',
      loadChildren: "./adminsettings/service/servicemanagement.module#ServiceManagementModule"
    },
    {
      path: 'prioritization',
      loadChildren: "./adminsettings/prioritization/prioritization.module#PrioritizationModule"
    },
    {
      path: 'spam',
      loadChildren: "./adminsettings/spam/filterkey.module#FilterKeyModule"
    },
    {
      path: 'globalsettings',
      loadChildren: "./adminsettings/globalsettings/globalsettings.module#GlobalSettingModule"
    },
    {
      path: 'phonebook',
      loadChildren: "./campaignmanager/smartdirectory/smartdirectory.module#SmartDirectoryModule"
    },
    {
      path: 'customerprofiling',
      loadChildren: "./customermanagement/segment-management/segment-manage.module#SegmentManagementModule"
    },
    {
      path: 'campaigns',
      loadChildren: "./campaignmanager/campaigns/campaigns.module#CampaignsModule"
    },
    {
      path: 'dbalert',
      loadChildren: './alertsmanager/onlinealerts/onlinealerts.module#OnlineAlertsModule'
    }, {
      path: 'offlinealerts',
      loadChildren: './alertsmanager/offlinealerts/offlinealerts.module#OfflineAlertsModule'
    },
    {
      path: 'creditdept',
      loadChildren: "./creditmanagement/departmentquota/departmentquota.module#DepartmentQuotaModule"
    },
    {
      path: 'credituser',
      loadChildren: "./creditmanagement/userquota/userquota.module#UserQuotaModule"
    },
    {
      path: 'studio',
      loadChildren: "./campaignmanager/smstemplate/smstemplate.module#SmsTemplateModule"
    },
    {
      path: 'messagetrack',
      loadChildren: './reports/messagetracking/messagetracking.module#MessageTrackingReportModule'
    },
    {
      path: 'campaignreports',
      loadChildren: './reports/campaignreports/campaignreports.module#CampaignReportsModule'
    },
    {
      path: 'interfacereports',
      loadChildren: './reports/interfacereports/interfacereports.module#InterfaceReportModule'
    },
    {
      path: 'deptreports',
      loadChildren: './reports/departmentreports/departmentreports.module#DepartmentReportModule'
    },
    {
      path: 'audit',
      loadChildren: './reports/auditreports/auditreports.module#AuditreportsModule'
    },
    {
      path: 'userreports',
      loadChildren: './reports/userreports/userreports.module#UserreportsModule'
    },
    {
      path: 'creditreports',
      loadChildren: './reports/usercreditreports/usercreditreports.module#UsercreditreportsModule'
    },
    {
      path: 'mailserver',
      loadChildren: './emailtosms/mailserver/mailserver.module#MailServerModule'
    },
    {
      path: 'emailtosms',
      loadChildren: './emailtosms/emailtosms/emailtosms.module#EmailtoSMSModule'
    },
    {
      path: 'smstoemail',
      loadChildren: './emailtosms/smstoemail/smstoemail.module#SMStoEmailModule'
    },
    {
      path: 'emailtemplate',
      loadChildren: './emailtosms/emailtemplate/emailtemplate.module#EmailTemplateModule'
    },
    {
      path: 'smstoemailreports',
      loadChildren: './reports/smstoemailreports/smstoemailreports.module#SMStoEmailReportModule'
    },
    {
      path: 'emailtosmsreports',
      loadChildren:'./reports/emailtosmsreports/emailtosmsreports.module#EmailToSMSReportModule'
    },
    {
      path:'platformcredits',
      loadChildren: "./creditmanagement/platformquota/platformquota.module#PlatformQuotaModule"
    },
    {
      path:'notificationalerts',
      loadChildren: "./creditmanagement/setnotification/setnotification.module#SetNotificationModule"
    }
    ]
  }, 
  {
    path: 'vmcp',
    component: ChangepasswordComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'session',
        loadChildren: './session/session.module#SessionModule'
      }]
  }, {
    path: '401',
    redirectTo: 'session/401'
  },
  {
    path: '**',
    redirectTo: 'session/404'
  }];
