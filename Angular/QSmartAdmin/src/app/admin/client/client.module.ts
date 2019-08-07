import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientAlertComponent } from './_model/clientAlert';
import { ClientComponent } from './manageclient/client.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientFilterPipe } from './_pipe/ClientFilterPipe';
import { ClientRoutes } from './client.router';
import { ClientService } from './_service/client.service';
import { CommonModule } from '@angular/common';
import { CreateClientComponent } from './createclient/createclient.component';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateLicenseComponent } from './update-license/update-license.component';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { AvatarModule } from 'ngx-avatar';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClientRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    MaterialModule,
    TranslateModule,
    FileHelpersModule,
    InternationalPhoneModule,
    AvatarModule,
    sharedDirectiveModule
  ],
  declarations: [ClientFilterPipe, ClientComponent, CreateClientComponent, ClientAlertComponent, ClientDetailsComponent, UpdateLicenseComponent, UpdateLicenseComponent],
  entryComponents: [CreateClientComponent, ClientAlertComponent, ClientDetailsComponent, UpdateLicenseComponent],
  providers: [ClientService],
})
export class ClientModule { }
