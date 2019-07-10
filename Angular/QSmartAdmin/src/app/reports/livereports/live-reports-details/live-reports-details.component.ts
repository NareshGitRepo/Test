import { ActionType, AlertMessageService } from "../../../_services/alertMessageService";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ILiveReports } from "../_model/livereports.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-client-details",
  templateUrl: "./live-reports-details.component.html",
  styleUrls: ['./live-reports-details.component.scss']
})
export class LiveReportsDetailsComponent implements OnInit {
  totalHospitals: ILiveReports[] = [];
  editData: any;
  resData: any;
  invalidStatus: boolean = false;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertMessage: AlertMessageService, private router: Router) {
    console.log("data=>", data);
    //  this.getReportsData();
    this.editData = this.data;
  }

  ngOnInit() { }

  // getReportsData() {
  //   this._clientserv.getReportsData(this.data.orgId).subscribe(
  //     response => {
  //       console.log(
  //         "response of getLicenseInfo :: " + JSON.stringify(response)
  //       );
  //       if (response.length != 0) {
  //         if (response.status == true) {
  //           this.totalHospitals = response.hospitals;
  //           this.resData = response;
  //         } else {
  //           this.invalidStatus = true;
  //         }
  //       } else {
  //         this.totalHospitals = [];
  //         this.alertMessage.showAlert(
  //           "No Hospitals to Select",
  //           ActionType.FAILED
  //         );
  //       }
  //     },
  //     error => {
  //       this.totalHospitals = [];
  //       let message = error.error.messages as string;
  //       let errorMessage =
  //         error.status == 404 ? "Error" : message ? message : error.message;
  //       console.log("Failed :: ", JSON.stringify(error));
  //       this.showAlert(errorMessage, ActionType.ERROR,error.status);
  //     }
  //   );
  // }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}
