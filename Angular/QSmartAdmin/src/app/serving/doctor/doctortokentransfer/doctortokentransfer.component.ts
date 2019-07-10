import { ActionType, AlertMessageService } from "../../../_services/alertMessageService";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDoctorData, IResponse, IServiceData, IServingTokens } from "../../_model/tokenmodel";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";

import { DoctorAlertComponent } from "../doctorservice/doctoralert";
import { Router } from "@angular/router";
import { TokenService } from "../../_service/tokenService";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-doctortokentransfer',
  templateUrl: './doctortokentransfer.component.html',
  styleUrls: ['./doctortokentransfer.component.scss']
})
export class DoctortokentransferComponent implements OnInit {

transferForm: FormGroup;
loading: boolean = false;
servicesList: IServiceData[] = [];
doctorsList: IDoctorData[] = [];

constructor(private dialogRef: MatDialogRef<DoctortokentransferComponent>,  private fb: FormBuilder,  @Inject(MAT_DIALOG_DATA) public tokenData: IServingTokens,
  private tokenService: TokenService,  private alertMessage: AlertMessageService,  private translate: TranslateService,  private router: Router,
  private dialog: MatDialog
) {
  this.getServicesAndDoctors();
}

ngOnInit() {
  this.transferForm = this.fb.group({
    service: [null, Validators.required],
    doctor: [null, Validators.required]
  });
}
getServicesAndDoctors() {
  this.loading = true;
  this.tokenService.getServicesAndDoctors(this.tokenData.ticketId).subscribe((response: IServiceData[]) => {
      if (response) {
        this.servicesList = response;
        console.log("servicesList :: ", this.servicesList);
      } else {
        this.servicesList = [];
      }
      this.loading = false;
    },
    error => {
      let message = error.error.messages as string;
      let errorMessage =
        error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    }
  );
}
changeService(serviceId: number) {
  console.log(serviceId);
  this.transferForm.get("doctor").setValue(null);
  let indx = this.servicesList.findIndex(x => x.serviceId == serviceId);
  if (indx != -1) {
    this.doctorsList = this.servicesList[indx].doctors.filter(x=>x.userId!=this.tokenData.doctorId);
  } else
    this.doctorsList = [];

  console.log("doctorsList :: ", this.doctorsList);
}
transferToken() {
  let dctrInfo = this.doctorsList.filter(x=>x.userId == +this.transferForm.value.doctor)[0];
  let doctorName = dctrInfo.firstname+" "+dctrInfo.lastname;
  let data: string = this.translate.instant('DoctorServingModule.transferAlert');
  data = data.replace('{Token}', this.tokenData.tokenNo);
  data = data.replace('{doctor}', doctorName);
  const dialogRef = this.dialog.open(DoctorAlertComponent, this.getStatusConfigAlert(data));
  dialogRef.afterClosed().subscribe(result => {
    if(result)
    {
  this.tokenService.transferedService( this.tokenData.ticketId,this.transferForm.value.service,this.transferForm.value.doctor).subscribe((response: IResponse) => {
                if (response.status) {
          // this.ticketSpliceOfData(ticketId);
          this.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(true);
        } else {
          this.showAlert(response.messages, ActionType.FAILED);
        }
        this.loading = false;
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage =
          error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
    }
  });
}
getStatusConfigAlert(data?: any): MatDialogConfig {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '400px';
  dialogConfig.disableClose = true;
  data ? dialogConfig.data = data : undefined;
  dialogConfig.disableClose = true;
  return dialogConfig;
}
showAlert(error: any, action: ActionType, status: number = 0) {
  if (status == 401) this.router.navigate(["401"]);
  else setTimeout(() => this.alertMessage.showAlert(error, action));
}
close(){
  this.dialogRef.close();
}
}
