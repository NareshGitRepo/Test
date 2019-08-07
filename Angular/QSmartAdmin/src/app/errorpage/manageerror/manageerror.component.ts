import { Component, OnInit } from '@angular/core';
import { ErrorpageService } from '../_service/errorpage.service';
import { IErrorInfo, Level } from '../_model/error.interface';
import { MatDialog } from '@angular/material';
import { CreateErrorComponent } from '../createerror/createerror.component';
import { ActionType, AlertMessageService, } from '../../_services/alertMessageService';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-manageerror',
  templateUrl: './manageerror.component.html',
  styleUrls: ['./manageerror.component.scss']
})

export class ErrorpageComponent implements OnInit {

  levelInfo: Level[] = [];
  errorlist: IErrorInfo[] = [];
  filterErrors: IErrorInfo[] = [];
  initPage = 0;
  searchdata: string;
  pageSize = environment.pageSize;
  loading: boolean = false;
  levelId: number;
  pagedlevelsData: Level[] = [];
  floorId=0;
  constructor(private errorservice: ErrorpageService, private translate: TranslateService,
    public dialog: MatDialog, private alertMessage: AlertMessageService, private router: Router) {
  }

  ngOnInit() {
    this.getLevelsInfo();
  }

  getLevelsInfo() {
    this.loading = true;
    this.errorservice.getlevelsInfo().subscribe((response) => {
      if (response) {
        console.log("Response==>", response)
        this.levelInfo = response;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getAllErrorMessages(floorid: number) {
    console.log("getAllErrorMessages:::", floorid);
    this.floorId=floorid;
    this.levelId = floorid;
    this.loading = true;
    this.errorservice.getAllErrorsByFacilitateIDId(floorid).subscribe((response: IErrorInfo[]) => {
      if (response) {
        console.log("Response==>", response)
        this.errorlist = response;
        this.getErrorData({ pageIndex: this.initPage, pageSize: this.pageSize });
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getData(pageObj) {
    let index = 0;
    const startingIndex = pageObj.pageIndex * pageObj.pageSize;
    const endingIndex = startingIndex + pageObj.pageSize;
    this.pagedlevelsData = this.levelInfo.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = pageObj.pageIndex;
    this.getAllErrorMessages(this.levelInfo[0].floorId)
  }

  getErrorData(pageObj) {
    let index = 0;
    const startingIndex = pageObj.pageIndex * pageObj.pageSize;
    const endingIndex = startingIndex + pageObj.pageSize;
    this.filterErrors = this.errorlist.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = pageObj.pageIndex;
  }

  onUpdate(row: any) {
    const dialogRef = this.dialog.open(CreateErrorComponent, {
      width: '30vw', height: '92.5%', panelClass: 'rightdailog',
      position: { right: '0px', bottom: '0' },
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllErrorMessages(this.levelId);
        //this.getAllErrorMessages();
      }
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  activeClass(event) {
    $('#sndrActv').find('mat-card').removeClass('pbActive');
    event.currentTarget.classList.add("pbActive");
  }

}
