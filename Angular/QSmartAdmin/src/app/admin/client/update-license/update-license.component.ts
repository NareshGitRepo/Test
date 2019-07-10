import { ActionType, AlertMessageService } from "../../../_services/alertMessageService";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { ClientService } from "../_service/client.service";
import { ILicense, IValidate, IResponse } from "../_model/client.model";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-license",
  templateUrl: "./update-license.component.html",
  styleUrls: ["./update-license.component.scss"]
})
export class UpdateLicenseComponent implements OnInit {
  fileerror = false;
  editData: any;
  FileData: any[] = [];
  fileType: string;
  fileList: FileList;
  validLicense: boolean = false;
  inValidLicense: boolean = false;
  licenseResponse: any;
  hospitalsList: any;
  Object = Object;
  readMode = true;
  message;
  updateLicenseObj: ILicense;
  loading: boolean = false;
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateLicenseComponent>, private translate: TranslateService,
    private _clientserv: ClientService, private alertMessage: AlertMessageService,
    private router: Router) {
    console.log("data=>", data);
    // this.editData = this.data;
  }

  ngOnInit() { }

  validate(file) {
    this.loading = true;
    console.log("Inside validate");
    this.FileData = [];
    const frmData = new FormData();
    frmData.append("file", this.fileList[0]);
    this._clientserv.valdiateAndReadData(frmData).subscribe(
      (response: IValidate) => {
        if (response) {
          if (response.validationStatus === "LICENSE_VALID") {
            this.validLicense = true;
            this.inValidLicense = false;
            // this.licenseform
            //   .get("licensePath1")
            //   .setValue(response.licenseFilePath);
            console.log("Validate Response", response);
            this.licenseResponse = response;
            this.editData = response.hospitals;
            console.log(" this.editData :: ", this.editData);
          } else {
            this.inValidLicense = true;
            this.validLicense = false;
            //this.showAlert(response.message, ActionType.FAILED);
          }
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  FileUpload(event) {
    //this.hideButton = true;
    this.fileList = event.target.files;
    console.log("In Lincense upload event.target.files[0] :: ", this.fileList.length);

    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      const extension = (file.name as string).split(".").pop();
      //if (action) {
      if (extension !== "l4j") {
        this.showAlert(this.translate.instant('ClientsModule.fileExtension'), ActionType.ERROR);
      } else {
        this.validate(file);
      }
      //  }
    }
  }

  onSubmit() {
    this.loading = true;
    console.log("data :: ", this.data);

    this.updateLicenseObj = {
      clientId: this.data.orgId,
      licenseId: this.licenseResponse.licenseId,
      licenseFile: this.licenseResponse.licenseFilePath
    };

    this._clientserv.updateLicenseInfo(this.updateLicenseObj).subscribe(
      (response: IResponse) => {
        if (response) {
          console.log("Response =>", JSON.stringify(response));
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.clearControls();
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
        }
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      }
    );
  }
  clearControls() {
    this.clearForm();
    this.dialogRef.close(true);
  }

  clearForm() {
    // this.licenseform.reset({status: true });
    this.fileerror = false;
  }
}
