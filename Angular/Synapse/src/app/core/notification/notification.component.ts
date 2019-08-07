import { Component } from '@angular/core';
import { NotificationServices } from '../../_services/NotificationServices';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  today: number = Date.now();
  row: any;
  constructor(private userService: NotificationServices) {}

  ngOnInit() {
    console.log("Loading ............................");
    console.log("NotificationComponent:ngOnInit");
    this.userService.getNotifications().subscribe(res => {
      this.row = res;
    });

  }
}
