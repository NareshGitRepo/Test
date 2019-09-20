import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LevelscreateComponent } from '../levelscreate/levelscreate.component';
import { DepartementscreateComponent } from '../departementscreate/departementscreate.component';
import { ILevelData, IDepartment } from '../_model/levelModel';
import { AlertMessageService, ActionType, AlertType } from '../../_services/alertMessageService';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LevelService } from '../_service/levelService';
import { LeveldetailsComponent } from '../leveldetails/leveldetails.component';
import { LevelAlertComponent } from '../_model/levelAlert';
declare var $: any;

@Component({
  selector: 'app-levelsmanage',
  templateUrl: './levelsmanage.component.html',
  styleUrls: ['./levelsmanage.component.scss']
})
export class LevelsmanageComponent implements OnInit {
  deptList: IDepartment[] = []
  initPage = 0;
  pageSize = environment.pageSize;
  searchdata: any;
  levellist: ILevelData[] = [];
  pagedlevelsData: ILevelData[] = [];
  pageddepartData: IDepartment[] = [];
  loading: boolean = false;
  floorId = 0;
  searchdepartement:any;
  constructor(public dialog: MatDialog, private alertMessage: AlertMessageService, private router: Router, private translate: TranslateService,
    private LevelService: LevelService, ) { }

  ngOnInit() {
    this.getFloorsWithDeptsByFacilitateId();
  }

  editLevel(levelData: ILevelData) {
    console.log("levelData::::", levelData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = levelData;
    const dialogRef = this.dialog.open(LevelscreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: ILevelData) => {
      console.log("levelData:::: updated", result);

      if (result) {
        this.getFloorsWithDeptsByFacilitateId();
        let indexl = this.pagedlevelsData.findIndex(x => x.floorId == result.floorId);
        if (indexl != -1) {
          this.pagedlevelsData[indexl].floorName = result.floorName;
        }
      }
    });
  }

  editDepartMent(departData: IDepartment) {
    console.log("departData==>", departData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = departData;
    const dialogRef = this.dialog.open(DepartementscreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: IDepartment) => {
      if (result) {
        this.getFloorsWithDeptsByFacilitateId();
        let index1 = this.pageddepartData.findIndex(x => x.deptId == result.deptId);
        if (index1 != -1) {
          this.pageddepartData[index1].deptName = result.deptName;
        }
    
      }
    });
  }

  createLevel() {
    const dialogRef = this.dialog.open(LevelscreateComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getFloorsWithDeptsByFacilitateId();
    });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addDepartement(floorId: number) {
    if (floorId > 0) {
      let DepartmentData ={floorId:floorId} as IDepartment;
      const dialogRef = this.dialog.open(DepartementscreateComponent, this.getDialogConfig(DepartmentData));
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFloorsWithDeptsByFacilitateId();
        }
      });
    }
  }

  getFloorsWithDeptsByFacilitateId() {
    this.loading = true;
    this.LevelService.getFloorsWithDeptsByFacilitateId().subscribe((response: ILevelData[]) => {
      console.log("response::", response);
      this.levellist = response;
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.loading = false;
    }, err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });
  }

  editDetailsLevel(levelDetails) {
    console.log("levelDetails==>" + JSON.stringify(levelDetails))
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = false;
    dialogConfig.data = levelDetails;
    this.dialog.open(LeveldetailsComponent, dialogConfig);
  }

  editDetailsDepartMent(services: IDepartment) {
    console.log("services==>", services)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = false;
    dialogConfig.data = services;
    this.dialog.open(LeveldetailsComponent, dialogConfig);
  }

  getData(_pageData) {
    let index = 0;
    const startingIndex = _pageData.pageIndex * _pageData.pageSize;
    const endingIndex = startingIndex + _pageData.pageSize;
    this.pagedlevelsData = this.levellist.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    this.deptList = this.pagedlevelsData.length > 0 ? this.pagedlevelsData[0].departments : [];
    if (this.pagedlevelsData.length > 0) {
      if (this.floorId > 0) {
        let indx = this.pagedlevelsData.findIndex(x => x.floorId == this.floorId);
        if (indx != -1)
          this.deptList = this.pagedlevelsData[indx].departments;
        else {
          this.pagedlevelsData[0].departments
          this.floorId = 0;
        }
      }
      else
        this.pagedlevelsData[0].departments
    }
    else
      this.deptList = [];

  }

  assignDpts(levelDetails: ILevelData) {
    this.loading = true;
    this.floorId = levelDetails.floorId;
    console.log('levelDetails=>', levelDetails);
    this.deptList = levelDetails.departments;
    console.log('deptList=>', this.deptList);
    this.loading = false;
  }

  editDepartements(deptDetails) {
    let data = deptDetails.deptName;
    const dialogRef = this.dialog.open(DepartementscreateComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      console.log("editDepartements::::::::::::;", result);

      if (result) {
        this.getFloorsWithDeptsByFacilitateId();
      }
           
    });
  }

  LevelActiveDialog(dept, status) {
    let data: any = status ? this.translate.instant('DevicesModule.activeStatus') : this.translate.instant('DevicesModule.deActiveStatus');
    const dialogRef = this.dialog.open(LevelAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let id = dept.deptId;
        let floorId = dept.floorId;
        let status = dept.status == 1 ? 0 : 1;
        this.LevelService.updateStatusByDeptId(id, status)
          .subscribe(responce => {
            if (responce.status) {
              let index = this.deptList.findIndex(x => x.deptId == id);
              if (index != -1) {
                this.deptList[index].status = status;
                let index1 = this.levellist.findIndex(x => x.floorId == floorId);
                if (index1 != -1)
                  this.levellist[index1].departments = this.deptList;
              }
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
            } else {
              this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          });
      }
    });
  }


  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
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
