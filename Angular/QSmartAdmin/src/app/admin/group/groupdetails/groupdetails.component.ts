import { Component, OnInit, Inject } from '@angular/core';
import { GroupService } from '../_service/group.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HospitalList } from '../_model/group.model';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-groupdetails',
  templateUrl: './groupdetails.component.html',
  styleUrls: ['./groupdetails.component.scss']
})

export class GroupDetailsComponent implements OnInit {

  selectedhosp: HospitalList[];
  orgName: string;
  // orgId: number;
  _tokenInfo: IUserUpdateDto;
  clientName: string;
  groupName: string;

  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public groupDetails: any,
    private alertMessage: AlertMessageService, private appConfig: AppConfig,
    private groupservice: GroupService,private router:Router,private translate:TranslateService) {
  }

  ngOnInit() {

    let tokenData = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgName = this._tokenInfo.orgName;
      // this.orgId = this._tokenInfo.organizations[0].orgId;
    }

    this.clientName = this.orgName;

    if (this.groupDetails != null) {
      this.groupName = this.groupDetails.organization;
      this.groupservice.getFacilitiesByGroupId(this.groupDetails.orgId).subscribe(response => {
        this.selectedhosp = response.hospitals;
        console.log("hospitals Info ::::::=>", this.selectedhosp);
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR,error.status);
      });

    }
  }

  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  



}

