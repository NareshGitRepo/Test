import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-tokentimeview',
  templateUrl: './tokentimeview.component.html',
  styleUrls: ['./tokentimeview.component.scss']
})
export class TokentimeviewComponent implements OnInit,OnDestroy {
  @Input() data:number;
  subscription;
  countDown;
  counter=0;
  @Output() timedata = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
     this.data=isNumeric(this.data)?this.data:0;
    //console.log("counter=>",this.counter);
    
    this.countDown = Observable.timer(0, 1000)
    .map(() => this.getdeta()); 
  }
  getdeta()
  {
    if(61>=this.data+1)
    this.timedata.emit(this.data+1);
    return ++this.data;
  }
  ontimedata(story: number) {
    (61>=story)
    this.timedata.emit(story);
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if(this.countDown)
    // this.countDown.unsubscribe();
  }
}
