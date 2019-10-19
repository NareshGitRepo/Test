import { Component } from '@angular/core';
import { interval, of, Subject, from, } from 'rxjs';
import { map, first, multicast } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RxJs';
  // Create an Observable that will publish a value on an interval
  seconds=interval(1000);
  values=of(1,2,3,4,5,6);
  square=map((val:number)=>val*val);
  shape=this.square(this.values);
  
  constructor(){
    // this.seconds.subscribe(n => console.log(`It's been ${n} seconds since subscribing!`))
    this.shape.subscribe(x =>
    console.log('shape::',x)
    );
    map((x:number)=>x*x)(of(1,2,3)).subscribe((v)=>console.log(`value: ${v}`))
   
    first()(of(1, 2, 3)).subscribe((v) => console.log(`value: ${v}`));

    //  console.log(of(1,2,3).map(x => x + 1).filter(x => x > 2));
    const subject=new Subject<number>();
    subject.subscribe({
      next: (v)=> console.log(`value:${v}`)
    });

    subject.subscribe({
      next: (v)=> console.log(`value:${v}`)
    });

    // subject.next(1);
    // subject.next(2);
   const observable=from([1,2,3]);
   observable.subscribe(subject);

   //multicast
   const source = from([1, 2, 3]);
   const subject1=new Subject();
   const multicasted=source.pipe(multicast(subject1));

   // These are, under the hood, `subject.subscribe({...})`:
   multicasted.subscribe({
     next:(v) => console.log(`value is : ${v}`)
   });
   multicasted.subscribe({
    next:(v) => console.log(`value is : ${v}`)
  });

  // This is, under the hood, `source.subscribe(subject)`:
  // multicasted.connect();
  }
 
}
