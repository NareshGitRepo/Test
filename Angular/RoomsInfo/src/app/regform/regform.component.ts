import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

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
  selector: 'app-regform',
  templateUrl: './regform.component.html',
  styleUrls: ['./regform.component.scss']
})
export class RegformComponent implements OnInit {

  pwd1:string;
  flag:boolean=false;
  notSame:boolean=false;

  matcher = new MyErrorStateMatcher();
  matcher1 = new MyErrorStateMatcher1();

  first_form:FormGroup;
  second_form:FormGroup;
  third_form:FormGroup;
  fourth_form:FormGroup;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  
  
  hide = true;
  

  constructor(private fb:FormBuilder) {
    this.first_form = this.fb.group({
      fname:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
      lname:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
      gender:['',[Validators.required]],
      date:['',[Validators.required]]
      });

      this.second_form = this.fb.group({
        email:['', [ Validators.required, Validators.email]],
        pswrd:['', [ Validators.required, Validators.minLength(6),Validators.pattern('[a-zA-Z0-9]+$')]],
        rpwd:['', [ Validators.required, Validators.minLength(6),Validators.pattern('[a-zA-Z0-9]+$')]],
        Agree:['',[Validators.required]]
        });

        this.third_form=this.fb.group({
          add:['', [ Validators.required,Validators.pattern('[a-zA-Z0-9]+$'),Validators.minLength(10)]],
          city:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
          state:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
          postal:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(6)]]
        });

    this.fourth_form=this.fb.group({
      tno:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10)]],
    });

    
   }

  ngOnInit() {
    
  }

  checkPasswords() { // here we have the 'passwords' group
  let pass = this.second_form.controls.pswrd.value;
  let confirmPass = this.second_form.controls.rpwd.value;
  if(pass === confirmPass)
  this.notSame= false;
  else
  this.notSame=true;
  // return pass === confirmPass ? notSame=false : { notSame= true }     
}

}
