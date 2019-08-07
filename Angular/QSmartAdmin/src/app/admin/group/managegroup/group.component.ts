import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GroupService } from '../_service/group.service';
import { IGroupList } from '../_model/group.model';
import * as _ from 'lodash';
import { CreateGroupComponent } from '../creategroup/creategroup.component';
import 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { GroupAlertComponent } from '../_model/group.alert';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { environment } from '../../../../environments/environment';
import { GroupDetailsComponent } from '../groupdetails/groupdetails.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent implements OnInit {

  groupDetails: IGroupList[] = [];
  filterGroups: IGroupList[] = [];
  public page = 0;
  pageSize = environment.pageSize;
  selectedPage: any;
  _filterType = '';
  searchdata = '';
  loading: boolean = false;
  constructor(public dialog: MatDialog, private groupservice: GroupService,
    private translate: TranslateService, private alertMessage: AlertMessageService,
    private router: Router) { }

  ngOnInit() {
    this.getGroups();
  }
  getGroups() {
    this.loading = true;
    this.groupservice.getGroupsByParentId().subscribe((response: IGroupList[]) => {
      console.log("response::::", JSON.stringify(response));
      this.groupDetails = response;
      this.getData({ pageIndex: this.page, pageSize: this.pageSize });
      this.loading = false;
    }, err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });
  }

  groupDetailsInfo(clientDetails) {
    console.log("clientDetails : " + JSON.stringify(clientDetails));
    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: clientDetails
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  getData(_pageData) {
    let index = 0;
    const startingIndex = _pageData.pageIndex * _pageData.pageSize;
    const endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterGroups = this.groupDetails.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filtered groups:::::", this.filterGroups);
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  createGroup() {
    const dialogRef = this.dialog.open(CreateGroupComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getGroups();
    });
  }

  onUpdate(row) {
    const dialogRef = this.dialog.open(CreateGroupComponent, this.getDialogConfig(row));
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getGroups();
    });

  }

  applyFilterStatus(group: IGroupList, status: number) {
    console.log("applyFilterStatus:" + JSON.stringify(group));
    let data: any = status ? this.translate.instant('GroupsModule.activeStatus') : this.translate.instant('GroupsModule.deactiveStatus');
    const dialogRef = this.dialog.open(GroupAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      console.log("Result===>", result);
      if (result) {
        group.status = status;

        this.groupservice.statusUpdate(group).subscribe((response: any) => {
          console.log("Group Status Response", response);
          if (response.status) {
            this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          } else {
            this.alertMessage.showAlert(response.messages, ActionType.FAILED);
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

  clearFilter() {
    console.log("clearFilter:");
    this.filterGroups = this.groupDetails;
    this.getData({ pageIndex: this.page, pageSize: this.pageSize });
  }

}
