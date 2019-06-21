import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

export interface Questions{
  name:string;
}
@Component({
  selector: 'app-nextpage',
  templateUrl: './nextpage.component.html',
  styleUrls: ['./nextpage.component.scss']
})
export class NextpageComponent implements OnInit {
  example_form:FormGroup;
  
  ngOnInit() {
  }
  
  constructor(private router:Router,private fb:FormBuilder) { 
    this.example_form = this.fb.group({
      add:['', [ Validators.required,Validators.pattern('[a-zA-Z0-9]+$'),Validators.minLength(10)]],
      city:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
      state:['', [ Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(5)]],
      postal:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(6)]],
      tno:['', [ Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(10)]],
     // Options:['', [ Validators.required]],
      });
  }
    
  questions:Questions[] = [
    {name: 'Your Favourite Friend'},
    {name: 'Your Favourite Place'},
    {name: 'Your favourite Author'},
    {name: 'Your favourite Director'},
  ];
  Success(){
    this.router.navigate(["success"]);
  }
}
