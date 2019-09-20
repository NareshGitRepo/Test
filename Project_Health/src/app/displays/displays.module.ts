import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe, } from "@angular/common";
import { MatIconModule, MatCardModule, MatButtonModule, MatListModule, MatProgressBarModule, MatMenuModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts";
import { DisplaysareaComponent } from "./displaysarea/displaysarea.component";
import { WaitingareaComponent } from "./waitingarea/waitingarea.component";
import { TranslateModule } from "@ngx-translate/core";
import { TokenalertComponent } from './tokenalert/tokenalert.component';
import { DisplayerrorComponent } from './displayerror/displayerror.component';
import { WaitingareaSyncComponent } from './waitingarea-sync/waitingarea-sync.component';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    FlexLayoutModule,
    ChartsModule,
    TranslateModule  
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [WaitingareaComponent, DisplaysareaComponent,TokenalertComponent,DisplayerrorComponent,WaitingareaSyncComponent],
  declarations: [],
 
})
export class DisplaysModule {

}