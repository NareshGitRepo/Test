import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss']
})
export class FirstComponent implements OnInit {

  constructor() {        
    //it's take updated values
    const bsubject=new BehaviorSubject(0);   // 0 is the initial value
     bsubject.subscribe({
       next: (x) =>console.log(`BobserverA:${x}`)
     })
     bsubject.next(1);
     bsubject.next(2);
     bsubject.next(3);
     bsubject.next(4);
     bsubject.subscribe({
      next: (v) => console.log(`BobserverB: ${v}`)
     });
     bsubject.next(5);
     console.log(`................`)


     // it can send old values to new subscribers, but it can also record a part of the Observable execution.
     const rsubject=new ReplaySubject(3);   // buffer 3 values for new subscribers
     rsubject.subscribe({
      next: (v) => console.log(`RobserverA: ${v}`)
    });
     
    rsubject.next(1);
    rsubject.next(2);
    rsubject.next(3);
    rsubject.next(4);
     
    rsubject.subscribe({
      next: (v) => console.log(`RobserverB: ${v}`)
    });
     
    rsubject.next(5);
    console.log(`................`)

    const rsubject1= new ReplaySubject(100, 500 /* windowTime */)
    rsubject1.subscribe({
      next:(x) =>console.log(`Robserver Time:${x}`)
    });

    let i=1;
    setInterval(()=>rsubject1.next(i++),200);
    setTimeout(() => {
      rsubject1.subscribe({
        next: (v) => console.log(`Robserver Time wait: ${v}`)
      });
    },1000);
    console.log(`................`)
    //only the last value of the Observable execution is sent to its observers, and only when the execution completes.
    const ASsubject = new AsyncSubject();
 
    ASsubject.subscribe({
    next: (v) => console.log(`ASobserverA: ${v}`)
    });
 
    ASsubject.next(1);
    ASsubject.next(2);
    ASsubject.next(3);
    ASsubject.next(4);
 
    ASsubject.subscribe({
     next: (v) => console.log(`ASobserverB: ${v}`)
    });
 
    ASsubject.next(5);
     ASsubject.complete();
     console.log(`................`)
  }

  ngOnInit() {
  }

}
