import { NgModule } from "@angular/core";
import{CustomColorDirective, ChangeBgColorDirective} from "./commonDirective";

@NgModule({
    exports:[
        CustomColorDirective,
        ChangeBgColorDirective
    ],
    declarations:[
        CustomColorDirective,
        ChangeBgColorDirective
    ]
})
export class sharedDirectiveModule {

}
