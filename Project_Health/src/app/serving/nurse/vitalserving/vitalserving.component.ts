import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { Itoken, Iroom, IServingTokens, IroomAndtoken, ItokenservingRes, IResponse, IServingTokenNData, docnurse, DoctorRoom } from '../../_model/tokenmodel';
import { MatDialogRef, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatPaginator, MatDialogConfig, MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TokenService } from '../../_service/tokenService';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { Router } from '@angular/router';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { NurseAlertComponent } from '../nursemanage/nursealert';
import { ServingtokenviewComponent } from '../servingtokenview/servingtokenview.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vitalserving',
  templateUrl: './vitalserving.component.html',
  styleUrls: ['./vitalserving.component.scss']
})
export class VitalservingComponent implements OnInit,OnDestroy {
  vitalForm: FormGroup;
  tokens: Itoken[] = [];
  tokenslist: Itoken[] = [];
  filtertokenslist: Itoken[] = []
  rooms: Iroom[] = [];
  filterrooms:Iroom[] = [];
  docrooms:DoctorRoom[]=[]
  loading: boolean = false;
  _tokenInfo: IUserUpdateDto;
  tokenInfo: IServingTokens;
  endFlag: boolean = false;
  srveflag: boolean = false;
  initPage = 0;
  pageSize = environment.pageSize;
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource= new MatTableDataSource();
  displayedColumns = ['apptDate', 'checkinTime', 'mrnNo', 'tokenNo', 'vitalStatus', 'roomNo', 'actions'];
  filterValues = {
    mrnNo: '',
    tokenNo: '',
    vitalStatus:-1
  };
  subscription:any;
  constructor(private dialogRef: MatDialogRef<VitalservingComponent>, @Inject(MAT_DIALOG_DATA) public data: docnurse, private fb: FormBuilder, private tokenService: TokenService,
    private dialog: MatDialog, private alertMessage: AlertMessageService, private router: Router, private appconfig: AppConfig, private translate: TranslateService, ) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (!this._tokenInfo && !tokenData)
      this.router.navigate(['401']);
      else 
      this.getVitalRoomsInfoByNurse();
   
  }

  ngOnInit() {
    this.vitalForm = this.fb.group({
      mrnFilter: [''],
      tokenFilter: [''],
      vitalFltr: ['-1']
    });
    this.vitalForm.get('mrnFilter').valueChanges
    .subscribe(
        name => {
          console.log('mrnFilter', name)
          this.filterValues.mrnNo = name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          if (this.paginator)
            this.paginator.firstPage();
      }
    )
    this.vitalForm.get('vitalFltr').valueChanges
    .subscribe(
        name => {
          console.log('vitalFltr', name)
          this.filterValues.vitalStatus = +name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          if (this.paginator)
            this.paginator.firstPage();
        }
    )
    this.vitalForm.get('tokenFilter').valueChanges
    .subscribe(
        name => {
          console.log('tokenFilter', name)
          this.filterValues.tokenNo = name;
          this.dataSource.filter = JSON.stringify(this.filterValues);
          if (this.paginator)
            this.paginator.firstPage();
      }
    )
  }
  sortData() {
    this.dataSource.sort = this.sort;
  }

  public doFilter(value: string, type: string) {
    console.log("dofilter", value);
     let filtertoken= this.tokens.filter(data=>
       data.mrnNo.toLowerCase().indexOf(this.vitalForm.value.mrnFilter) !== -1
      && data.tokenNo.toString().toLowerCase().indexOf(this.vitalForm.value.tokenFilter) !== -1)
      console.log("tokenno=>",filtertoken);
  }
  getVitalRoomsInfoByNurse() {
    this.loading = true;
    console.log("data=>", this.data);

    this.tokenService.getVitalRoomsInfoByNurse(this.data).subscribe((response: IroomAndtoken) => {
      if (response && response != null) {
       
        this.docrooms = response.doctorRooms;
        console.log("datares=>", response,this.docrooms);
        this.tokens = response.tokens;
        this.dataSource = new MatTableDataSource<Itoken>(this.tokens);
        console.log("dataSource=>",this.dataSource);
        
        this.dataSource.filterPredicate = this.createFilter(); 
        this.getListData({ pageIndex: this.initPage, pageSize: this.pageSize });
        if (this.docrooms.length == 0)
          this.showAlert(this.translate.instant('DoctorServingModule.roomError'), ActionType.ERROR);
      }
      else {
        this.docrooms = [];
        this.tokens = [];
        this.dataSource = new MatTableDataSource<Itoken>(this.tokens);
      }
      if(this.tokens.length==this.dataSource.data.length)
      {
        this.loading = false;
         setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
        }
      else
      this.subscription = Observable.interval(1000).subscribe(data => {
        if(this.tokens.length==this.dataSource.data.length)
        {
          if (this.subscription)
      this.subscription.unsubscribe();
      setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
        this.loading = false; 
        }
      });
     // this.loading = false;
    },
      error => {
        this.docrooms = [];
        this.tokens = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  serveToken(row: Itoken) {
    this.loading = true;
    row.serveUserId = this._tokenInfo.userId;
    row.orgId = this._tokenInfo.orgId;
    // let roomtype=row.roomtype;
    this.rooms= this.docrooms.filter(y=>y.doctorId==row.drId)[0].rooms;
    let roomData = this.rooms.findIndex(x => x.roomId == row.roomId);
    if (roomData != -1) {
      row.roomNo = this.rooms[roomData].roomNumber;
      row.roomtype = this.rooms[roomData].roomType;
      row.serveUserId = this._tokenInfo.userId;
      let data: string = this.translate.instant('DoctorServingModule.serveAlert');
      data = data.replace('{Token}', row.tokenNo);
      const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tokenService.callTokenForServing(row).subscribe((response: ItokenservingRes) => {
            console.log("response=>", response, row, this._tokenInfo.userId,this.dataSource.data);
            if (response.status) {
              this.srveflag = true;
              this.dataSource.data = this.dataSource.data.filter((x:Itoken) => x.ticketId != row.ticketId);
              this.showAlert(response.messages, ActionType.SUCCESS);
              // if (tokenIndex != -1) {
              //   this.dataSource.data.splice(tokenIndex, 1);
              // }
            }
            else {
              // row.roomtype=roomtype;
              this.showAlert(response.messages, ActionType.FAILED);
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
        else{
          this.loading=false;
        }
      });
    }
    console.log('row', row);

  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "80vw";
    dialogConfig.height = '70%';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }



  getStatusConfigAlert(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  endToken(row: Itoken) {
    let data: string = this.translate.instant('DoctorServingModule.endAlert');
    data = data.replace('{Token}', row.tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        let tokenIndex = this.tokens.findIndex(x => x.ticketId == row.ticketId);
        if (tokenIndex != -1) {
          this.tokenService.endTokenInfo(row.ticketId).subscribe((response: IResponse) => {
            if (response.status) {
              this.endFlag = true;
              this.tokens.splice(tokenIndex, 1);
              // this.dataSource = new MatTableDataSource<Itoken>(this.tokens);
              this.dataSource.data = this.dataSource.data.filter((x:Itoken) => x.ticketId != row.ticketId);
              this.showAlert(response.messages, ActionType.SUCCESS);

            }
            else {
              this.showAlert(response.messages, ActionType.FAILED);
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
        else {
          this.showAlert(this.translate.instant('DoctorServingModule.noTokensError'), ActionType.FAILED);
          this.loading = false;
        }
      }
    });
  }



  getListData(obj) {
    this.dataSource.paginator = this.paginator;
  }


  close() {
    this.dialogRef.close(this.srveflag);
  }
  createFilter(): (data: Itoken, filter: string) => boolean {
    console.log('createFilter');

    let filterFunction = function (data, filter): boolean {
      let searchTerms:Itoken = JSON.parse(filter);
      let ststus=searchTerms.vitalStatus== -1? true : data.vitalStatus==searchTerms.vitalStatus;
      
      return data.mrnNo.toLowerCase().indexOf(searchTerms.mrnNo.toLowerCase()) !== -1
      && data.tokenNo.toString().toLowerCase().indexOf(searchTerms.tokenNo.toLowerCase()) !== -1
      && ststus;
    }

    return filterFunction;

  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
