import { Routes } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from './core';
import { LoginComponent } from './login/login.component';
import { DisplaysareaComponent } from './displays/displaysarea/displaysarea.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './dashboard/fdashboard/fdashboard.module#FDashboardModule'
    },
    {
      path: 'checkedin',
      loadChildren: './reports/checkedin/checkedin.module#CheckedinModule'
    },
    {
      path: 'tokenreports',
      loadChildren: './reports/tokenreports/tokenreports.module#TokenRepModule'
    },
    {
      path: 'success',
      loadChildren: './reports/successregistration/successregistration.module#SuccessRegModule'
    },
    {
      path: 'failed',
      loadChildren: './reports/failedregistration/failedregistration.module#FailedregistrationModule'
    },
    {
      path: 'noteligible',
      loadChildren: './reports/noteligible/noteligible.module#NoteligibleModule'
    },
    {
      path: 'feedback',
      loadChildren: './reports/feedback/feedback.module#FeedbackModule'
    },
    {
      path: 'eperformance',
      loadChildren: './reports/empperformance/empperformance.module#EmpperformanceModule'
    },
    {
      path: 'aperformance',
      loadChildren: './reports/appointments/appointments.module#AppointmentsModule'
    },
    {
      path: 'cdrreports',
      loadChildren: './reports/livereports/livereports.module#LiveReportsModule'
    },
    {
      path: 'patientjourney',
      loadChildren: './reports/patientjourney/patientjourney.module#PatientJourneyModule'
    },
    {
      path: 'nurseserving',
      loadChildren: './serving/nurse/nurseserving.module#NurseServingModule'
    },
    {
      path: 'doctorserving',
      loadChildren: './serving/doctor/doctorserving.module#DoctorServingModule'
    },
    {
      path: 'printtoken',
      loadChildren: './printtoken/printtoken.module#PrintTokenModule'
    },
    {
      path: 'tokenserving',
      loadChildren: './serving/tokenserving/tokenserving.module#TokenServingModule'
    },
    {
      path: 'fdashboard',
      loadChildren: './dashboard/mdashboard/mdashboard.module#MDashboardModule'
    },
    {
      path: 'ddashboard',
      loadChildren: './dashboard/ddashboard/ddashboard.module#DDashboardModule'
      
    },
    {
      path: 'profile',
      loadChildren: './profile/profile.module#ProfileModule'
    },
    {
      path: 'client',
      loadChildren: './admin/client/client.module#ClientModule'
    }, {
      path: 'users',
      loadChildren: './users/users.module#UsersModule'
    }, {
      path: 'devices',
      loadChildren: './devices/devices.module#DevicesModule'
    }, {
      path: 'group',
      loadChildren: './admin/group/group.module#GroupModule'
    }, {
      path: 'facility',
      loadChildren: './admin/facility/facility.module#FacilityModule'
    },
    {
      path: 'privileges',
      loadChildren: './privileges/privileges.module#PrivilegesModule'
    },
    {
      path: 'errorpage',
      loadChildren: './errorpage/errorpage.module#ErrorPageModule'
    },
    {
      path: 'level',
      loadChildren: './levels/levels.module#LevelsModule'
    },
    {
      path: 'buildings',
      loadChildren: './building/building.module#BuildingModule'
    },
    {
      path: 'services',
      loadChildren: './services/services.module#ServicesModule'
    },
    {
      path: 'servicestypes',
      loadChildren: './ServiceTypes/servicetype.module#ServiceTypeModule'
    },
    {
      path: 'manualtoken',
      loadChildren: './manualtoken/manualtoken.module#ManualtokenModule'
    },
    {
      path: 'roommanagement',
      loadChildren: './room/room.module#RoomsModule'
    },
    {
      path: 'about',
      loadChildren: './about/about.module#AboutModule'
    }
    ]
  },
  {
    path: 'display',
    component: DisplaysareaComponent
  },
  {
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
