import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmgroupdelete',
  template: `<h1 mat-dialog-title> {{'ActionNames.confirmation' | translate}} </h1>
  <div mat-dialog-content>
    <p>
        <b>{{message}}</b>
    </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button color="primary" [mat-dialog-close]="true">{{'ActionNames.yes' | translate}}</button>
    <button mat-button color="primary"  [mat-dialog-close]="false" cdkFocusInitial>{{'ActionNames.no' | translate}}</button>
  </div>`,
})
export class ProfileConfirmComponent {

  public message: any

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.message = data;

    console.log("data:::" + JSON.stringify(data));
  }
}
