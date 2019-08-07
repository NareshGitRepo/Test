import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionRoutes } from './session.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { UnErrorComponent } from './error/unerror.component';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SessionRoutes),
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    NotFoundComponent,
    ErrorComponent,
    ForgotComponent,
    UnErrorComponent
 ]
})

export class SessionModule {}
