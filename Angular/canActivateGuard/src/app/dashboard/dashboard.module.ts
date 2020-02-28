import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { AuthGuardService } from '../guards/auth-guard.service';
import { RoleGuardService } from '../guards/role-guard.service';
import { DeauthGuardService } from '../guards/deauth-guard.service';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [LayoutComponent, HomeComponent, AdminComponent, UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  providers: [
    AuthGuardService,
    RoleGuardService,
    DeauthGuardService
  ],
})
export class DashboardModule { }
