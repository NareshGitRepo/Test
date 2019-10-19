import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

export interface Gender {
}

export interface Appointment {
    apptType: string;
    aptDate: string;
    aptId: string;
    checkInStatus: number;
    dept: string;
    dob: string;
    doctor: string;
    endCheckInMins: number;
    facility: string;
    firstName: string;
    floorId: number;
    gender: Gender;
    id: number;
    lastName: string;
    mobileNo: string;
    mrnNumber: string;
    orgId: number;
    reasonToVisit: string;
    serviceId: number;
    startCheckInMins: number;
}

export interface RootObject {
    appointments: Appointment[];
    messages: string;
    regStatus: boolean;
    status: boolean;
}
@Component({
  selector: 'app-validate-mrn-no',
  templateUrl: './validate-mrn-no.component.html',
  styleUrls: ['./validate-mrn-no.component.scss']
})
export class ValidateMrnNoComponent implements OnInit {

 
  RootObject:any={};
  appointments:Appointment[]=[];
  kioskid:number;
  mrnNo:number;
  VMrnNo_form:FormGroup;
  showData=false;

  Kid(event){
    this.kioskid=event.target.value;
    console.log('kid',this.kioskid);
    
   }
   MrnNo(event){
     this.mrnNo=event.target.value;
     console.log('mrn',this.mrnNo);
     
   }
   
   opensnackbar(message:string, action:string){
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }

   constructor(private fb:FormBuilder,private mainservice:MainService, private snackBar:MatSnackBar){
    this.VMrnNo_form=this.fb.group({
      mrn:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(5)]],
      kid:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(2)]]
    })
   }
  
  ngOnInit() {
  }
  submit(){
    this.mainservice.ValidMrnNo(this.kioskid,this.mrnNo).subscribe(
      res=>{
        console.log(res);
       // this.RootObject=res;
       // console.log('rootObj',this.RootObject);
        this.appointments=res['appointments'];
        console.log('appoinments',this.appointments);
        this.RootObject.messages=res['messages'];
        this.RootObject.regStatus=res['regStatus'];
        this.RootObject.status=res['status'];
        this.RootObject.appoinments=this.appointments;
        console.log('validate Mrn',this.RootObject);
        this.showData=true;  
        this.opensnackbar('Load Data','Success');
      },
      error =>{
        this.opensnackbar('Unable to load Data','Error');
        console.log('error');
       }
    )
  }
}
