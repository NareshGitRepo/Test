import * as _ from 'lodash';

import { ActionType, AlertMessageService } from "../../../_services/AlertMessageService";
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatDialogConfig } from '@angular/material';

import { IMsgPriorityInfo } from '../_model/prioritizationmodel';
import { PrioritizationActionsComponent } from '../actions/prioritization-actions.component';
import { PrioritizationService } from "../_services/prioritizationService";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from '../../../../environments/environment';
import { PrioritydetailsComponent } from '../prioritydetails/prioritydetails.component';

@Component({
  selector: 'app-prioritization',
  templateUrl: './prioritization.component.html',
  styleUrls: ['./prioritization.component.scss']
})
export class PrioritizationComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["priorityId", "categoryDesc", "priorityName", "priorityDesc", "actions", "ServiceInfo"];

  dialogRef: MatDialogRef<PrioritizationActionsComponent> | null;
  priorityList: IMsgPriorityInfo[] = [];
  loading: boolean = false;
  spans = [];
  constructor(private _prioritizationService: PrioritizationService, public dialog: MatDialog, private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router) { }

  ngOnInit() {
    this.getPrioritizationData();

  }
  getPrioritizationData() {

    this.loading = true;
    this._prioritizationService.getPrioritizationData().subscribe((response: IMsgPriorityInfo[]) => {

      if (response != undefined) {
        this.priorityList = response;
        this.dataSource = new MatTableDataSource(this.priorityList);
        this.cacheSpan('categoryDesc', d => d.msgCategory.categoryDesc);
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string;
        let errorMessage =
          error.status == 404
            ? this.translate.instant("ActionNames.errorResponse")
            : message
              ? message
              : error.message;
        console.error("E-getPrioritizationData==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.priorityList.length;) {
      let currentValue = accessor(this.priorityList[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.priorityList.length; j++) {
        if (currentValue != accessor(this.priorityList[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
    console.log("this.spans=>", this.spans);

  }
  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  updateRemarks(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      priorityId: element.priorityId,
      priorityDesc: element.priorityDesc,
    }
    this.dialogRef = this.dialog.open(PrioritizationActionsComponent, dialogConfig);
    this.dialogRef.afterClosed().subscribe(result => {

      console.log(result);

      if (result != undefined) {

        this.priorityList[this.priorityList.findIndex(x => x.priorityId == result.priorityId)].priorityDesc = result.priorityDesc;

        this.dataSource = new MatTableDataSource(this.priorityList);
      }
    });
  }
  GetSericeInfo(Prioritydetails: IMsgPriorityInfo) {
    console.log("element=>", Prioritydetails);
    {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
      dialogConfig.disableClose = true;
      dialogConfig.data = Prioritydetails ;
      this.dialog.open(PrioritydetailsComponent, dialogConfig);
    }

  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    if (data)
      dialogConfig.data = data;

    dialogConfig.disableClose = true;
    return dialogConfig;
  }


  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  isGroup(index, item): boolean {
    return item.group;
  }
}
