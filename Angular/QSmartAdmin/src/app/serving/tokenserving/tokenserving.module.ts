import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AvatarModule } from 'ngx-avatar';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { TokenServingRoutes } from './tokenserving.router';
import { TokensurveComponent } from './tokensurve/tokensurve.component';
import { TokenservinginfoComponent } from './tokenservinginfo/tokenservinginfo.component';
import { TokenstimeviewComponent } from './tokenstimeview/tokenstimeview.component';
import { TFormatTimePipeWithSec, TFormatTimePipe } from '../_pipe/filterpipe';
import { TokenAlertComponent } from './tokensurve/tokenalert';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TokenServingRoutes),
    NgxMaterialTimepickerModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    PerfectScrollbarModule,
    MaterialModule,
    TranslateModule,
    AvatarModule
  ],
  declarations: [TokensurveComponent, TokenservinginfoComponent, TokenstimeviewComponent,TFormatTimePipeWithSec,TFormatTimePipe,TokenAlertComponent],
  entryComponents: [TokenservinginfoComponent,TokenstimeviewComponent,TokenAlertComponent],
  providers: []
})
export class TokenServingModule { }
