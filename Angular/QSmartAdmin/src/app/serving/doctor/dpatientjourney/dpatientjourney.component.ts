import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { IToken, ITokenJourney } from '../../_model/tokenmodel';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';

import { PatientjourneyComponent } from '../../nurse/patientjourney/patientjourney.component';
import { Router } from '@angular/router';
import { TokenService } from '../../_service/tokenService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dpatientjourney',
  templateUrl: './dpatientjourney.component.html',
  styleUrls: ['./dpatientjourney.component.scss']
})


export class DpatientjourneyComponent implements OnInit {
  dataSource: any;
  tokenJourneyList:ITokenJourney[]=[];
  displayedColumns = ['roomName', 'serviceResourseName', 'waitingTime', 'careStartTime','careEndTime','status'];
  loading :boolean = false;
  dataFlag:boolean=false;

  constructor(private dialogRef: MatDialogRef<PatientjourneyComponent>, @Inject(MAT_DIALOG_DATA) public tokenData: IToken,
  private tokenService: TokenService,private alertMessage: AlertMessageService, private translate: TranslateService,
  private router: Router) {
      console.log('tokenData:', tokenData);

      this.loading = true;
      this.tokenService.getTokenTraverse(this.tokenData.ticketId).subscribe((response: ITokenJourney[]) => {

      if (response && response != null) {
        console.log("data=>", response);
        this.tokenJourneyList = response;
        this.dataSource = new MatTableDataSource<ITokenJourney>(this.tokenJourneyList);
        this.dataFlag=true;
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

ngOnInit() {
}


showAlert(error: any, action: ActionType, status: number = 0) {
  if (status == 401)
    this.router.navigate(['401']);
  else setTimeout(() => this.alertMessage.showAlert(error, action));
}

  close(){
    this.dialogRef.close();
  }


}
