import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { RoleGuardService } from '../guards/role-guard.service';
import { DeauthGuardService } from '../guards/deauth-guard.service';
import { UserComponent } from './user/user.component';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent},
      {
        path: 'admin', component: AdminComponent,
        canActivate: [RoleGuardService],
        data: {role: 'Admin'},
      },
      { path: 'user', component: UserComponent, canDeactivate:[DeauthGuardService],}
    ]
  }
];