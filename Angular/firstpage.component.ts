import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.scss']
})
export class FirstpageComponent implements OnInit {
  pwd1:string;
  flag:boolean=false;
  ngOnInit() {
  }

  title = 'MailReg';
  example_form:FormGroup;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  hide = true;
  constructor(private router:Router,private fb:FormBuilder){

this.example_form = this.fb.group({
fname:['', [ Validators.required]],
lname:['', [ Validators.required]],
gender:['',[Validators.required]],
email:['', [ Validators.required, Validators.email,]],
pswrd:['', [ Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]*$')]],
rpwd:['', [ Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]*$')]],
Agree:['',[Validators.required]]
});
   }

   
 
   ConfirmPwd(event){console.log('inside pswd check',this.example_form.value.pswrd==this.pwd1);
   
    this.pwd1=event.target.value;
    if(this.example_form.value.pswrd==this.pwd1){
      this.flag=true;
    }
   }
  Nextpage(){
    //console.log('inside nextPage()');
  console.log('form data ',this.example_form.value.pswrd);
  
    //this.router.navigateByUrl('next');
    this.router.navigate(["next"]);
  }
}
