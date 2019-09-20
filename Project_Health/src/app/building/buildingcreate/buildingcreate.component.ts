import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { MAT_DIALOG_DATA } from '../../../../node_modules/@angular/material';
import { IBuilding } from '../_model/buildingmodel';

@Component({
  selector: 'app-buildingcreate',
  templateUrl: './buildingcreate.component.html',
  styleUrls: ['./buildingcreate.component.scss']
})
export class BuildingcreateComponent implements OnInit {
  action:string = "Add";
  loading: boolean = false;
  buildingForm:FormGroup;
  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public data: IBuilding) { }

  ngOnInit() {
    this.buildingForm = this.fb.group({
      buildingName:['',Validators.required],
      buildingArabicName:['',Validators.required],
    });

    if(this.data != null){
      this.action = "Edit";
      this.buildingForm.patchValue(this.data);
    }
  }

}
