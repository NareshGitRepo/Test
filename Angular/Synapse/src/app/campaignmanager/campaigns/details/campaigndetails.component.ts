import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Isender, ICampaignDataModel } from '../_model/campaignModel';
import { CampaignService } from '../_service/campaignService';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-campaigndetails',
  templateUrl: './campaigndetails.component.html',
  styleUrls: ['./campaigndetails.component.scss']
})
export class CampaigndetailsComponent implements OnInit {
  
  loading: boolean = false;
  senderdata: Isender[];
  selectSender: string = '';
  campDetails: any;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<CampaigndetailsComponent>,private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: ICampaignDataModel, private campService: CampaignService, private alertMessage: AlertMessageService,
    private router: Router) {
    console.log("CAMPDETAILS==>", this.data);
  }

  ngOnInit() {
    this.getsenders();
    if (this.data != null) {
      this.campDetails = this.data;
    }
  }

  getsenders() {
    this.loading = true;
    this.campService.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;
          this.getSenderName();
        }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  getSenderName() {
    let index = this.senderdata.findIndex(x => x.senderId == this.campDetails.senderId + '');
    this.selectSender = index != -1 ? this.senderdata[index].senderName : '';
    console.log("SENDER==>",this.selectSender)

  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}