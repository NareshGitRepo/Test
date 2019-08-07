import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { MaterialModule } from '../../_shared/material.module';
import { TokenreportsComponent } from './tokenmanage/tokenreports.component';
import { tokenRepRoutes } from './tokenreports.router';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(tokenRepRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    AvatarModule
  ],
  declarations: [TokenreportsComponent],
  providers: [DatePipe, TokenreportsComponent]
})
export class TokenRepModule { 
  }