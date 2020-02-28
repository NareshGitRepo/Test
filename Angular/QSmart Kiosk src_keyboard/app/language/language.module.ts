import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from './language.component';
import { LanguageRoutes } from './language.routing';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';
import { ErrorSnackBarComponent } from './alert/error';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LanguageRoutes),
    TranslateModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [
   
  ],
  declarations: [LanguageComponent,ErrorSnackBarComponent],
  entryComponents: [ErrorSnackBarComponent]

})

export class LanguageModule { }
