import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutes } from './registration.router';
import { RegisterService } from './_service/register.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { globalFilterPipeModule } from '../_pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(RegistrationRoutes),
    TranslateModule,
    FlexLayoutModule,
    globalFilterPipeModule
  ],
  providers: [
    RegisterService,
    DashboardService
  ],
  declarations: [RegistrationComponent]
})
export class RegistrationModule { }