import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
// material modules
import { MatTreeModule} from '@angular/material';
// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// for international phone number with flags
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { PrivilegesComponent} from './managepriviliges/privileges.component';
import { PrivilegesRoutes } from './privileges.routing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../_shared/material.module';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(PrivilegesRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    MatTreeModule,
    TranslateModule,
    MaterialModule,
    sharedDirectiveModule
  ],
  declarations: [PrivilegesComponent]
})
export class PrivilegesModule { }
