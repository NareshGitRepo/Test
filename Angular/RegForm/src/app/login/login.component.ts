import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

export interface emaildetails{
  emailid:any;
  pswd:any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  login_form:FormGroup;
  res=[];
  edetails:emaildetails[]=[
    { emailid:'naresh@vectramind.com', pswd:'N@aresh1189'},{ emailid:'naresh123@vectramind.com', pswd:'N@aresh1189'},
  ];
  validUser:boolean=false;

  constructor(private fb:FormBuilder,private router:Router) {
    this.login_form=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]]
    })
   }

  ngOnInit() {
  }

 
  
  Submit(){
    
   let indx = this.edetails.findIndex(x=>{
        return x.emailid==this.login_form.value.email && x.pswd==this.login_form.value.password;
    });
    console.log(indx);
    if(indx!=-1)
     {
        this.router.navigate(["valid"]);
    }
      else
      {
      this.router.navigate(["invalid"]);
      }
  }
}

