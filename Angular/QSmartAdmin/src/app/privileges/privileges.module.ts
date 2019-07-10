import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';

// material modules
import {
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatTreeModule
} from '@angular/material';

// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// for international phone number with flags
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { PrivilegesRoutes } from './privileges.router';
import { TranslateModule } from '@ngx-translate/core';
import { PrivilegesComponent } from './privilegemanage/privileges.component';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(PrivilegesRoutes),
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatTreeModule
  ],
  declarations: [PrivilegesComponent]
})
export class PrivilegesModule { }
