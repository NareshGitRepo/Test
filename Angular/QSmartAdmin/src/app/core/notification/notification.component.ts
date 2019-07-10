import * as _ from 'lodash';

import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
import { INotification, IResponse, INotificationData } from './_model/notification';

import { NotificationServices } from './_service/NotificationServices';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit, AfterViewChecked {
  @Input() data: INotificationData;
  notificationsList: INotification[] = [];
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;

  constructor(private notificationService: NotificationServices,
    private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router) {
  }


  ngOnInit() {
    this.notificationsList = this.data.Data;
  }
  ngAfterViewChecked() {
   
    if (!_.isEqual(this.notificationsList, this.data.Data)) {
      this.notificationsList = this.data.Data;
      console.log('notificationsList=>', this.data);
    }
  }

  updateAllNotifications(updateAll: boolean, id?: number) {
    this.loading = true;
    let notificationIdsList = [];
    if (updateAll) {
      this.notificationsList.forEach(x => {
        notificationIdsList.push(x.id);
      });

    } else {
      notificationIdsList.push(id);
    }
    let inputData = { notificationIds: notificationIdsList };

    console.log('this.notificationIdsList ', inputData);
    this.notificationService.updateAllNotifications(inputData).subscribe((responce: IResponse) => {
      console.log('responce => ', responce);

      if (responce.status) {
        if (updateAll) {
          this.notificationsList.splice(0, this.notificationsList.length);
        }
        else {
          let index = this.notificationsList.findIndex(x => x.id == id);
          if (index != -1) {
            this.notificationsList.splice(index, 1);
          }

        }
        this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
      } else {
        this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}
