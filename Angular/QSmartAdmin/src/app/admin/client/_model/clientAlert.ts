import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-client',
  template: `<h1 mat-dialog-title> {{ 'ActionNames.confirmation' | translate }}</h1>
  <div mat-dialog-content>
    <p>
        <b>{{data}}</b>
    </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button color="primary" [mat-dialog-close]="true">{{ 'ActionNames.yes' | translate }}</button>
    <button mat-button color="primary"  [mat-dialog-close]="false">{{ 'ActionNames.no' | translate }}</button>
  </div>`,
})
export class ClientAlertComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.data = data;
    console.log("data:::" + JSON.stringify(data));
  }

}
