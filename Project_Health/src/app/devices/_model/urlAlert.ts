import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-urlalert',
  template: `
  <h1 mat-dialog-title class="wrap-word"> {{ 'DevicesModule.urlGeneration' | translate }}</h1>
  <div mat-dialog-content>
    <p class="wrap-word">
        URL: <b>{{data}}</b>
    </p>
    
  </div>
  <div mat-dialog-actions>
  <button  mat-button color="primary" [mat-dialog-close]="true" ngxClipboard [cbContent]="data">{{ 'ActionNames.copy' | translate }}</button>
    <button mat-button color="primary"  [mat-dialog-close]="false">{{ 'ActionNames.no' | translate }}</button>
  </div>
 `,
})
export class UrlAlertComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ) {
    this.data = data;
    console.log("data:::" + JSON.stringify(data));
  }

}
