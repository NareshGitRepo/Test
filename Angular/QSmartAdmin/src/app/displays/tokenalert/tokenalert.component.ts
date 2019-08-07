import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-tokenalert',
  templateUrl: './tokenalert.component.html',
  styleUrls: ['./tokenalert.component.scss']
})
export class TokenalertComponent implements OnInit {
  ColourStr:string='tknDefault';

  constructor(private dialogRef: MatDialogRef<TokenalertComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
   console.log("data=>33",data);
  //  let audio = new Audio();
  //  audio.src = "assets/audio/charm.wav";
  //  audio.load();
  //  audio.play();
   }

  ngOnInit() {
 
  }

}
