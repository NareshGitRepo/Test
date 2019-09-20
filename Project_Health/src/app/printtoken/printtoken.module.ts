import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { printTokenRoutes } from './printtoken.router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { PrinttokenManageComponent } from './printtokenmanage/printtoken.component';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(printTokenRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
  ],
  declarations: [PrinttokenManageComponent],
  providers: [DatePipe]
})
export class PrintTokenModule {
}