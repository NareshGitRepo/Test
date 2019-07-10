import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-displayerror',
  templateUrl: './displayerror.component.html',
  styleUrls: ['./displayerror.component.scss']
})
export class DisplayerrorComponent implements OnInit,OnDestroy {
  currentDateTime: number;
  myTimeout;
  @Input()
  data: any;
  constructor() { }

  ngOnInit() {
    this.myTimeout = Observable.interval(1).subscribe(data => {
      this.currentDateTime = Date.now();
    });
  }
  ngOnDestroy() {
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
  }
}
