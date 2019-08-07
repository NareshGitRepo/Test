import { ActionType, AlertMessageService } from "../../../_services/alertMessageService";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { ClientService } from "../_service/client.service";
import { IHospitals, ILicenseData, ILHospital } from "../_model/client.model";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-client-details",
  templateUrl: "./client-details.component.html",
  styleUrls: ["./client-details.component.scss"]
})
export class ClientDetailsComponent implements OnInit {
  totalHospitals: ILHospital[] = [];
  editData: any;
  resData: ILicenseData;
  invalidStatus: boolean = false;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ClientDetailsComponent>,
    private translate: TranslateService, private _clientserv: ClientService, private alertMessage: AlertMessageService, private router: Router) {
    console.log("data=>", data);
    this.getLicenseInfo();
    this.editData = this.data;
  }

  ngOnInit() { }

  getLicenseInfo() {
    this._clientserv.getLicenseInfo(this.data.orgId).subscribe(
      (response: ILicenseData) => {
        console.log("response of getLicenseInfo :: ", response);
        if (response.status) {
          this.totalHospitals = response.hospitals;
          this.resData = response;
          this.invalidStatus = true;
        } else {
          this.totalHospitals = [];
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
      },
      error => {
        this.totalHospitals = [];
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      }
    );
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}