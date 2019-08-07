import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { IAlertDataModel, Isender } from '../_model/offlineModel';
import { OfflineService } from '../_service/offlineservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  alertDetails: IAlertDataModel;
  selectSender: string = '';
  senderdata: Isender[] = [];
  loading: boolean = false;

  constructor(private dialogRef: MatDialogRef<DetailsComponent>, private alertMessage: AlertMessageService, private router: Router, private _service: OfflineService, @Inject(MAT_DIALOG_DATA) public data: IAlertDataModel) {
    this.alertDetails = data;
  }

  ngOnInit() {
    this.getsenders();
  }

  getsenders() {
    this.loading = true;
    this._service.getsenders().subscribe((result: Isender[]) => {
      //console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;
        }
        this.getSenderName();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? "Failed for your request" : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }

  getSenderName() {
    let index = this.senderdata.findIndex(x => x.senderId == this.alertDetails.senderId + '');
    //console.log("Index==>", index);
    this.selectSender = index != -1 ? this.senderdata[index].senderName : '';
    //console.log("selectSender==>", this.selectSender);
    this.loading = false;
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
