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
      add:['', [ Validators.required]],
      city:['', [ Validators.required]],
      state:['', [ Validators.required]],
      postal:['', [ Validators.required]],
      tno:['', [ Validators.required]],
      Options:['', [ Validators.required]],
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
