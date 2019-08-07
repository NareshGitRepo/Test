import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-confirmservicedelete',
  template: `<h1 mat-dialog-title> {{'ActionNames.confirmation'| translate}} </h1>
  <div mat-dialog-content>
    <p>
        <b>{{message}}</b>
    </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button color="primary" [mat-dialog-close]="true" >{{'ActionNames.yes'| translate}}</button>
    <button mat-button color="primary"  [mat-dialog-close]="false" cdkFocusInitial>{{'ActionNames.no'| translate}}</button>
  </div>`,
})
export class ConfirmServiceDeleteComponent {

  public message: any

  constructor(@Inject(MAT_DIALOG_DATA)  data: any, private Snackbar:MatSnackBar, public dialogRef: MatDialogRef<ConfirmServiceDeleteComponent>,) {
    this.message=data;
   }

   delete()
   {

    this.dialogRef.close();
   }

openSnackbar(message:string, action:string)
  {
      this.Snackbar.open(message,action,{
        duration: 2000
      });
  }


}
