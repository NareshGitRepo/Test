import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { IPlatformAlert, ISenderList } from '../_model/setnotification.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SetNotificationService } from '../_service/setnotification.service';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';

@Component({
  selector: 'app-notificationdetails',
  templateUrl: './notificationdetails.component.html',
  styleUrls: ['./notificationdetails.component.scss']
})
export class NotificationdetailsComponent implements OnInit {
  notificationDetails: any;
  loading: boolean = false;
  notificationdata: IPlatformAlert[];
  senderName: string = '';
  senderdata: ISenderList[] = [];
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<NotificationdetailsComponent>, private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: IPlatformAlert, private notificationService: SetNotificationService,
    private router: Router, private alertMessage: AlertMessageService) {
    console.log("NOTIFICATIONDETAILS==>", this.data);
  }
  ngOnInit() {
    this.getsenders();
  }
 
  getsenders() {
    this.loading = true;
    this.notificationService.getAllActiveSenders().subscribe((result: ISenderList[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          let index=result.findIndex(x=> x.senderId==this.data.senderId);
          if(index!=-1){
            this.senderName = result[index].senderName;
          }
         
        }
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
