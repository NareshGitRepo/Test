import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfig } from '../../_helpers/app.config';

@Component({
  selector: 'app-tokenalert',
  templateUrl: './tokenalert.component.html',
  styleUrls: ['./tokenalert.component.scss']
})
export class TokenalertComponent {
  ColourStr:string='tknDefault';
  constructor(private dialogRef: MatDialogRef<TokenalertComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private appConfig: AppConfig) {
   
   }
}
