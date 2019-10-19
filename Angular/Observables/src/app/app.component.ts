import { Component } from '@angular/core';
import { of, observable, Observable, timer } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Observables';
  nameChangeLog: string[] = [];
  heroForm: FormGroup;
  constructor(public fb:FormBuilder){

     // Create simple observable that emits three values
    const myObservable = of(1, 2, 3);

     // Create observer object
    const myObserver = {
      next: x => console.log('Observer got a next value: ' + x),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    // Execute with the observer object
    myObservable.subscribe(myObserver);
    
    this.heroForm=this.fb.group({name:[null]});
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
    console.log('nameChangeLog::',this.nameChangeLog)
  }
 
}
// // This function runs when subscribe() is called
// function SeqeSub(observer) {
//     // synchronously deliver 1, 2, and 3, then complete
//     observer.next(1);   observer.next(2);  observer.next(3);  observer.complete();

//     // unsubscribe function doesn't need to do anything in this
//     // because values are delivered synchronously
//     return {unsubscribe() {}};
// }

// // Create a new Observable that will deliver the above sequence
// const sequence= new Observable(SeqeSub)

// // execute the Observable and print the result of each notification
// sequence.subscribe({
//   next(num) { console.log(num); },
//   complete() { console.log('Finished sequence'); },
//   error(err) { console.log('Received an errror: ' + err)}
// })