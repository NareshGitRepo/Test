import * as _ from "lodash";
import { ActionType, AlertMessageService, AlertType } from "../../../_services/alertMessageService";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ClientAlertComponent } from "../_model/clientAlert";
import { ClientDetailsComponent } from "../client-details/client-details.component";
import { ClientService } from "../_service/client.service";
import { Component } from "@angular/core";
import { CreateClientComponent } from "../createclient/createclient.component";
import { IClient } from "../_model/client.model";
import { TranslateService } from "@ngx-translate/core";
import { UpdateLicenseComponent } from "../update-license/update-license.component";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"]
})
export class ClientComponent {

  clientList: IClient[] = [];
  filterUsers: IClient[] = [];
  public page = 0;
  public pageSize = environment.pageSize;
  selectedPage: any;
  _filterType = "";
  searchdata: string;
  loading: boolean = false;
  constructor(private _clientserv: ClientService, public dialog: MatDialog, private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router) { }
  applyFilterStatus(filterValue: string) {
    if (filterValue != "") {
      this.filterUsers = this.clientList;
      let obj = _.filter(this.clientList, function (dataObj) {
        return dataObj.status + "" == filterValue;
      });
      this.filterUsers = obj;
      //console.log("filterUsers :: "+JSON.stringify(this.filterUsers));
    }
  }

  clearFilter() {
    console.log("clearFilter:");
    this.filterUsers = this.clientList;
    this.getData({ pageIndex: this.page, pageSize: this.pageSize });
  }

  ngOnInit() {
    this.getAllClients();
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  getAllClients() {
    this.loading = true;
    this._clientserv.getAllClients().subscribe(
      response => {
        if (response) {
          console.log("response :: ", JSON.stringify(response));
          this.clientList = response.orgs;
          this.getData({ pageIndex: this.page, pageSize: this.pageSize });
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
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }

  getData(_pageData) {
    let index = 0;
    const startingIndex = _pageData.pageIndex * _pageData.pageSize;
    const endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterUsers = this.clientList;
    this.filterUsers = this.clientList.filter(() => {
      index++;
      return index > startingIndex && index <= endingIndex ? true : false;
    });
    console.log("UserData::" + JSON.stringify(this.filterUsers));
  }

  getInfo() {
    this.getData({ pageIndex: this.page, pageSize: this.pageSize });
  }

  onEdit(row: IClient) {
    const dialogRef = this.dialog.open(CreateClientComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getAllClients();
      }
    });
  }

  addClient(): void {
    console.log("Create Role:");
    const dialogRef = this.dialog.open(CreateClientComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          // this.alertMessage.showAlert(response.messages, ActionType.SUCCESS, AlertType.SUCCESS);
          this.getAllClients();
        } else {
          console.log("No Response :: ");
        }
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage =
          error.status == 404
            ? this.translate.instant("ActionNames.errorResponse")
            : message
              ? message
              : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      }
    );
  }

  statusChange(row: IClient, status: number) {
    let data: any = status
      ? this.translate.instant("ClientsModule.activate")
      : this.translate.instant("ClientsModule.deActivate");
    const dialogRef = this.dialog.open(
      ClientAlertComponent,
      this.getStatusConfig(data)
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        row.status = status;
        this._clientserv.updateClientStat(row).subscribe(
          responce => {
            if (responce.status) {
              this.alertMessage.showAlert(
                responce.messages,
                ActionType.SUCCESS,
                AlertType.SUCCESS
              );
              this.getAllClients();
            } else {
              this.alertMessage.showAlert(
                responce.messages,
                ActionType.FAILED,
                AlertType.ERROR
              );
            }
          },
          error => {
            let message = error.error.messages as string;
            let errorMessage =
              error.status == 404
                ? this.translate.instant("ActionNames.errorResponse")
                : message
                  ? message
                  : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          }
        );
      }
    });
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "250px";
    dialogConfig.disableClose = true;
    data ? (dialogConfig.data = data) : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  clientDetails(clientDetails) {
    console.log("clientDetails : " + JSON.stringify(clientDetails));
    const dialogRef = this.dialog.open(ClientDetailsComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: clientDetails
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
  updateLicense(clientDetails) {
    console.log("clientDetails : " + JSON.stringify(clientDetails));
    const dialogRef = this.dialog.open(UpdateLicenseComponent, {
      width: "40vw",
      height: "92.5%",
      panelClass: "rightdailog",
      position: { right: "0px", bottom: "0" },
      disableClose: true,
      data: clientDetails
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
