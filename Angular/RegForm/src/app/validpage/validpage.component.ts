import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validpage',
  templateUrl: './validpage.component.html',
  styleUrls: ['./validpage.component.scss']
})
export class ValidpageComponent implements OnInit {

  flag:boolean=false;
  public id:any;
  public tokenno:number;
  

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(private router:Router) { }

  ngOnInit() {
  }

 submit(){
     this.flag=true;
     console.log('input value =>',this.emailFormControl.value)
     this.id=this.emailFormControl.value;
  
  }
 call(value){console.log('o/p value ',value);
 
  this.tokenno=value;
 } 
}
