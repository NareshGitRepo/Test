import { NgModule } from "@angular/core";
import { FilterkeyComponent } from "./manage/filterkey.component";
import { MaterialModule } from "../../_shared/material.module";
import { RouterModule } from "@angular/router";
import { FilterkeyRoutes } from "./filterkey.routing";
import { CreatefilterkeyComponent } from "./create/createfilterkey.component";
import { FilterConfirmComponent } from "./_model/filterkeyconfirm";
import { keywordFilterPipe } from "./_pipe/keywordfilter";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SortKeywordsPipe } from "./_pipe/keywordsorting";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FilterkeydetailsComponent } from './details/filterkeydetails.component';
import { sharedDirectiveModule } from "../../_directives/sharedDirectives";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
   imports:[
    MaterialModule,
    RouterModule.forChild(FilterkeyRoutes),
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    sharedDirectiveModule,
    TranslateModule
   ],
   declarations:[
    FilterkeyComponent,
    CreatefilterkeyComponent,
    FilterConfirmComponent,
    keywordFilterPipe,
    SortKeywordsPipe,
    FilterkeydetailsComponent,    
   ],
   entryComponents:[CreatefilterkeyComponent,FilterConfirmComponent,FilterkeydetailsComponent],
   providers:[] 
})
export class FilterKeyModule { }