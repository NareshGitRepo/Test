import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreatemtComponent } from '../create/createmt.component';
import { ICampaignDataModel, Isender, IResponse, IGlobalGetRes, IGlobalGet } from '../_model/campaignModel';
import { CampaignService } from '../_service/campaignService';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CampaigndetailsComponent } from '../details/campaigndetails.component';
@Component({
  selector: 'app-smscampaign',
  templateUrl: './smscampaign.component.html',
  styleUrls: ['./smscampaign.component.scss']
})
export class SmscampaignComponent implements OnInit, OnDestroy {
  _showDetails: boolean = false;
  today: number = Date.now();
  initPage = 0;
  pageSize = environment.pageSize;
  statusdata = { '-1': 'Pending For Approval', '-2': 'Rejected', '1': 'Pending', '2': 'Scheduled', '3': 'Running', '4': 'Paused', '5': 'Aborted', '6': 'Completed', '7': 'Modified', '8': 'Expired','9': 'Promotion time over','10': 'Credits not available' };
  totalCampaigns: ICampaignDataModel[] ;
  pagedCampaigns: ICampaignDataModel[] = [];
  selectedCampaign: ICampaignDataModel;
  selectSender: string = '';
  senderdata: Isender[] = [];
  loading: boolean = false;
  searchdata: string = '';
  _arabic = /[\u0621-\u064A]/;
  _roleCode: string = '';
  loginInfo: IUserUpdateDto;
  myTimeout: any;
  minitcounter: number = 15;
  countDown;
  globallist: IGlobalGet[] = [];
  editTime: number = 15;
  messageVisibility:boolean;
  constructor(public dialog: MatDialog, private campaignService: CampaignService, private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router, private appConfig: AppConfig) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loading=true;
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      window["startTime"]='9:15';
      window["endTime"]='21:15';
      this.campaignService.getAllSystemParameter().subscribe((result: IGlobalGetRes) => {
        if (result) {
          this.globallist = result.systemParameter;
          let sindex=result.systemParameter.findIndex(x=>x.parameterName=='CTT_START_TIME');
          let eindex=result.systemParameter.findIndex(x=>x.parameterName=='CTT_END_TIME');
          console.log("sindex==>",sindex,eindex);
          
          if(sindex!=-1)
            window["startTime"]= result.systemParameter[sindex].value;
          if(eindex!=-1)
            window["endTime"]= result.systemParameter[eindex].value;
          console.log("after sindex==>", window["startTime"],window["endTime"]);
          let index = this.globallist.findIndex(x => x.parameterName.toLowerCase() == 'camp_edit_time');
          console.log("getAllSystemParameter=>", result, this.globallist,index);
          if (index != -1) {
            try {
              this.minitcounter=this.editTime = +this.globallist[index].value;
              console.log("editTime=>", this.editTime);
            } catch (e) {
              console.log('error=>', e);
              this.minitcounter=this.editTime = 15;
            }
            if(this.editTime<1)
            {
              this.minitcounter=this.editTime=15;
              console.log("editTime=>1", this.editTime);
            }
          }

        }
        this.getsenders();
      }, error => {
        this.loading=false;
        this.globallist = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      });

    }
    else {
      this.router.navigate(['401']);
    }

  }
  getsenders() {
    this.loading = true;
    this.campaignService.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result;
        }
      this.getAllCampaigns();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }

  getAllCampaigns() {
    console.log("this._roleCode=>", this._roleCode);
    this.searchdata='';
    this.loading = true;
    this.campaignService.getAllCampaigns(this._roleCode).subscribe((result: ICampaignDataModel[]) => {
      console.log("result=>", result);
      if (result)
      {
        if (result.length > 0) {
          this.totalCampaigns = result;

          if (this.myTimeout) {
            this.minitcounter = this.editTime;
          }
          else {
            this.myTimeout = Observable.interval(60000).subscribe(data => {
              this.minitcounter++;
              console.log("minitcounter=>", this.minitcounter);
            });
          }
          this.initPage = 0;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
        else
        this.totalCampaigns=[];
      }
      else
      this.totalCampaigns=[];
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getAllCampaigns==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.pagedCampaigns = this.totalCampaigns.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    // this.initPage = _pageData.pageSize;
    if (this.pagedCampaigns.length > 0)
      this.assignCamp(this.pagedCampaigns[0]);
    console.log("UserData::" + JSON.stringify(this.pagedCampaigns));
  }
  assignCamp(camp: ICampaignDataModel) {
    console.log("ICampaignDataModel=>", camp);
    this.selectedCampaign = camp;
    this.messageVisibility=false;
    let index = this.senderdata.findIndex(x => x.senderId == camp.senderId + '');
    this.selectSender = index != -1 ? this.senderdata[index].senderName : '';
  }
  campaignDetails(selectedCampaign) {
    this.dialog.open(CampaigndetailsComponent, this.getDialogConfig(selectedCampaign));
  }
  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  ngOnInit() {
    this.countDown = Observable.timer(0, 60000)
      .map(() => this.minitcounter);
  }


  createNewMTCampaign(): void {

    console.log("createNewCampaign :");
    const dialogRef = this.dialog.open(CreatemtComponent, {
      width: '45vw', height: '92%', panelClass: 'rightdailog',
      position: { right: '0px' },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result) {
        this.getAllCampaigns();
      }
    });

  }
  searchchange() {
    let campData: ICampaignDataModel;
    this.selectedCampaign = campData;
  }
  editCampaign(camp: ICampaignDataModel) {
    camp.timeDiff = camp.timeDiff - this.minitcounter;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '45vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = camp;
    console.log("camp=>", camp);

    const dialogRef = this.dialog.open(CreatemtComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: boolean) => {

      if (result) {
        this.getAllCampaigns();
        // let index = this.totalCampaigns.findIndex(x => x.campId == result.campId);
        // if (index != -1) {
        //   this.totalCampaigns[index] = result;
        // }
        // index = this.pagedCampaigns.findIndex(x => x.campId == result.campId);
        // if (index != -1) {
        //   this.pagedCampaigns[index] = result;
        // }
        console.log("data=>", result);
        // this.assignCamp(result);
      }
    });


  }

  deleteCampaign(camp: ICampaignDataModel) {
    this.loading = true;
    console.log("deleteCampaign :");
    this.campaignService.updateCampaignStatus(camp.campId, 5).subscribe((response: IResponse) => {
      console.log("response=>", response);
      if (response.status) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS)
        this.getAllCampaigns();
      }
      else {
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
        this.loading = false;
      }
      if (!response)
        this.loading = false;
    },
      error => {
        this.loading = false;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-deleteCampaign==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
      });

  }
  ngOnDestroy() {
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
  }

}
