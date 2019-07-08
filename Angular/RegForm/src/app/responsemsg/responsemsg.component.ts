import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-responsemsg',
  templateUrl: './responsemsg.component.html',
  styleUrls: ['./responsemsg.component.scss']
})
export class ResponsemsgComponent implements AfterViewInit {
 
  @Input('emailid') public eid:any;
  @Output() tokenid = new EventEmitter();
  
  @ViewChild('ccomponent',{static:false}) ccomponent:ElementRef;
  @ViewChild('template',{static : false}) template:ElementRef;
  constructor() { }
ngOnInit(){
 console.log("view init template =>",this.template.nativeElement.value);
}
  ngAfterViewInit(): void {
   // throw new Error("Method not implemented.");
  console.log("view init template =>",this.template.nativeElement.value);
  }

  onChange(value) {
    console.log("value =>",value)

    this.tokenid.emit(value);
    console.log("ccomponent:", this.ccomponent.nativeElement.value);
    console.log("tokenid =>",this.tokenid);
    console.log("template =>",this.template.nativeElement.value);
    this.template.nativeElement.value;
  }
}
