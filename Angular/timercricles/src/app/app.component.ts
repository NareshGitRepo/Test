import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timercricles';

  readonly progress: Observable<number>;

  constructor() {
    this.progress = this.emulateProgress();
  }

  emulateProgress() {
    return new Observable<number>(observer => {
      let val = 100;
      const interval = setInterval(() => {
        if (val >0) {
          val--;
        } else {
          val = 0;
        }

        observer.next(val);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    });
  }
}
