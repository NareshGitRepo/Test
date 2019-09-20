import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatSort } from '@angular/material';
import { IToken } from '../_model/patientjourneymodel';
import { environment } from '../../../../environments/environment';
import { PatientJourneyService } from '../_service/patientjounery.service';
import { Router } from '@angular/router';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-patientcompletejourney',
  templateUrl: './patientcompletejourney.component.html',
  styleUrls: ['./patientcompletejourney.component.scss']
})
export class PatientcompletejourneyComponent implements OnInit {
  dataSource = new MatTableDataSource<IToken>();
  reportsList:IToken[] = [];
  filterListReports: IToken[] = [];
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  loading :boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  // displayedColumns= ['date', 'tokenNum', 'room', 'srvResource', 'waitTime', 'careStarttime', 'careEndtime', 'status'];
  displayedColumns= ['roomName', 'serviceResourseName', 'waitingTime', 'careStartTime', 'careEndTime', 'status'];

  constructor(private datePipe: DatePipe, private dialogRef: MatDialogRef<PatientcompletejourneyComponent>,  @Inject(MAT_DIALOG_DATA) public patientData: any,private patientjourneyService:PatientJourneyService, 
    private router: Router, private alertMessage: AlertMessageService, 
    private translate: TranslateService) 
  { 
    console.log("patientData ==>", patientData);
  }

  ngOnInit() {
    this.getTokenTraverse();
  }

  getTokenTraverse(){
    this.loading = true;
    this.patientjourneyService.getTokenTraverse(this.patientData.reportId).subscribe( (response :IToken[]) => {
      console.log("Result-API2 ==>", response);
      if(response && response != null){
        this.reportsList = response;
        this.dataSource = new MatTableDataSource(this.reportsList);
        this.dataSource.sort = this.sort;
      }
      this.loading = false;
    },
    err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    })
  }



  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  close() {
    this.dialogRef.close();
    this.reportsList = [];
  }

}
