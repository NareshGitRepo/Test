import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  IDepartment, IService,  } from '../_model/levelModel';
declare var $: any;

@Component({
  selector: 'app-leveldetails',
  templateUrl: './leveldetails.component.html',
  styleUrls: ['./leveldetails.component.scss']
})
export class LeveldetailsComponent implements OnInit {

  services: IService[] = [];
 

  constructor(private dialogRef: MatDialogRef<LeveldetailsComponent>, @Inject(MAT_DIALOG_DATA) public  data: IDepartment) { }

  ngOnInit() {
    this.services=this.data.services;
    // this.data.forEach(element => {
    //   this.services = element.services;
    // });
  }

  close(e) {
    this.dialogRef.close();
    $(e.path).parent().find('.rightdailog').removeClass('rightdailog').addClass('closeRgtdailog');
  }
}
