import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pipes';
  Celebration=new Date();

  birthday=new Date();
  toggle=true;// start with true == shortDate

  get format(){ 
      return this.toggle ? 'shortDate' : 'fullDate'; 
    }
  toggleFormat(){ 
      this.toggle = !this.toggle;
    }
}
