import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, SimpleChanges, Input, ViewChild, ElementRef, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ViewchildComponent } from './viewchild.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  title = 'Lifecyclehooks1';
  value:string='';
  time: number = 0;
  //single child
  @ViewChild(ViewchildComponent,{static:false}) child:ViewchildComponent; //compnent based

  //multiple child
  @ViewChildren(ViewchildComponent) childd: QueryList<ViewchildComponent>; //compnent based

  @ViewChild('para',{static:false}) child1:ElementRef;  //temp_refernece based

  constructor(private cdf:ChangeDetectorRef) {
    console.log('constructor')
  }
  ngOnChanges(changes: SimpleChanges) {
    alert(changes)
    // let cur = JSON.stringify(changes.time.currentValue);
    // let prev = JSON.stringify(changes.time.previousValue);
    // if (changes.time.currentValue != changes.time.previousValue) {
    //   console.log('current value=>', cur)
    //   console.log('previous value=>', prev)
    // }
  }
  ngOnInit() {
    console.log('OnInit')
    setInterval(() => {
      this.time++;
    }, 1000);
  this.value='Naresh';
  }

  ngDoCheck() {
    console.log('Do Check')
  
  }
  ngAfterContentInit() {
    console.log('AfterContentInit')
  }
  ngAfterContentChecked() {
    console.log('AfterContentChecked')

  }
  ngAfterViewInit() {
    console.log('AfterViewInit')
    //value change but show error, solution:1)By changing the ViewChild property in ngAfterContentInit life cycle hook, 2)Manually calling change detection using ChangeDetectorRef
     this.child.name="angular"; 
    console.log('child5=>',this.child)
     this.cdf.detectChanges(); //solution-2
    console.log('getuser=>',this.child1.nativeElement)
  }
  ngAfterViewChecked() {
    console.log('AfterViewChecked')
    console.log('child6=>',this.child.name)
    console.log('getuser=>',this.child.getuser)
    this.childd.forEach(x=> console.log(x))

  }
  ngOnDestroy() {
    console.log('Destroy')
  }

}
