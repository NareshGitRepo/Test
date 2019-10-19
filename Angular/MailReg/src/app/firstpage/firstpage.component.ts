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
export class MyErrorStateMatcher1 implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
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
  notSame:boolean=false;
  ngOnInit() {
  }

  title = 'MailReg';

  example_form:FormGroup;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  
  matcher = new MyErrorStateMatcher();
  matcher1 = new MyErrorStateMatcher1();
  hide = true;
  constructor(private router:Router,private fb:FormBuilder){

this.example_form = this.fb.group({
fname:['', [Validators.pattern('[a-zA-Z]+$')]],
lname:['', [Validators.pattern('[a-zA-Z]+$')]],
gender:[''],
email:['', [Validators.email]],
pswrd:['', [Validators.pattern('[a-zA-Z0-9]+$')]],
rpwd:['', [Validators.pattern('[a-zA-Z0-9]+$')]],
Agree:['']
});
}

checkPasswords() { // here we have the 'passwords' group
  let pass = this.example_form.controls.pswrd.value;
  let confirmPass = this.example_form.controls.rpwd.value;
  if(pass === confirmPass)
  this.notSame= false;
  else
  this.notSame=true;
  // return pass === confirmPass ? notSame=false : { notSame= true }     
}
   
 
  /* ConfirmPwd(event){console.log('inside pswd check',this.example_form.value.pswrd==this.pwd1);
   
    this.pwd1=event.target.value;
    if(this.example_form.value.pswrd==this.pwd1){
      this.flag=true;
    }
   } */
  Nextpage(){
    //console.log('inside nextPage()');
  console.log('form data ',this.example_form.value.pswrd);
  
    //this.router.navigateByUrl('next');
    this.router.navigate(["next"]);
  }
}
