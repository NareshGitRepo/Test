import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-dtokentimeview',
  templateUrl: './dtokentimeview.component.html',
  styleUrls: ['./dtokentimeview.component.scss']
})
export class DtokentimeviewComponent implements OnInit, OnDestroy {
  @Output() timedata = new EventEmitter<number>();
  @Input() data: number;
  subscription;
  countDown;
  counter = 0;
  constructor() { }

  ngOnInit() {
    this.data = isNumeric(this.data) ? this.data : 0;  console.log('this.data',this.data);
    this.countDown = Observable.timer(0, 1000).map(() => this.getdeta());
    console.log('this.countDown',this.countDown);
  }
  getdeta() {
    if (61 >= this.data+1)
      this.timedata.emit(this.data+1);  
    return ++this.data;
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if(this.countDown)
    // this.countDown.unsubscribe();
  }

}
