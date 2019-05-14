import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  birthday=new Date();
  toggle=true;// start with true == shortDate

  get format(){ 
      return this.toggle ? 'shortDate' : 'fullDate'; 
    }
  toggleFormat(){ 
      this.toggle = !this.toggle;
    }
}
