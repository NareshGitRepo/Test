import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";
import { ISnackBarData } from "../_model/language.model";

@Component({
    selector: 'error_snack-bar-component',
    template: `<span class="error" style="-ms-word-break: break-all;word-break: break-all;">
    <h3>{{snackBarMessage.arMessage}}</h3>
    <h3>{{snackBarMessage.enMessage}}</h3>
     </span>`,
         styles: [`
     .error {
       color: #ff0000;
     }
     .error h3 {
       font-size:18px;
     }
    `],
})
export class ErrorSnackBarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public snackBarMessage: ISnackBarData, private cdref: ChangeDetectorRef) {
        console.log("snackBarMessage==>", snackBarMessage);
    }

}

