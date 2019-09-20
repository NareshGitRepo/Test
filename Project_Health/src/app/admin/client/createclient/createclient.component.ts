import { ActionType, AlertMessageService } from "../../../_services/alertMessageService";
import { Component, Inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { ClientService } from "../_service/client.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../../_helpers/app.config";
import { IValidate, IUpload, IResponse } from "../_model/client.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-createclient",
  templateUrl: "./createclient.component.html",
  styleUrls: ["./createclient.component.scss"]
})
export class CreateClientComponent implements OnInit {

  clientform: FormGroup;
  imageUrlShow = false;
  imageSrc: any;
  imageUrl: String;
  errormessage: any;
  fileList: FileList;
  submitbtn = false;
  submitbtn1 = false;
  FileData: any[] = [];
  fileerror = false;
  hideButton = true;
  validLogo: boolean = false;
  inValidLogo: boolean = false;
  validLicense: boolean = false;
  inValidLicense: boolean = false;
  readMode = true;
  message: any;
  country: string;
  btnSubmitDisaable: boolean = false;
  hospitalList: any;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private _clientserv: ClientService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public row: any, private dialogRef: MatDialogRef<CreateClientComponent>,
    private translate: TranslateService, private appconfig: AppConfig, private alertMessage: AlertMessageService, private cdrf: ChangeDetectorRef,
    private router: Router
  ) {
    this.country = this.appconfig.getCountry();
  }

  ngOnInit() {
    // const emailregex: RegExp =
    // tslint:disable-next-line:max-line-length
    // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.clientform = this.fb.group({
      orgId: [""],
      organization: ["", Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern("[a-zA-Z0-9%_-s ]+")])],
      address: ["", [Validators.required, Validators.maxLength(100), Validators.minLength(5)],[this.appconfig.UserMinValidator(5)]],
      emailId: [null, Validators.compose([Validators.required, Validators.pattern("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$")])],
      mobileNo: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(15)])],
      logoPath: [""],
      licensePath: [''],
      licenseId: '12345',
      status: 1
    });

    if (this.row != null) {
      this.row.parentId = this.row.partyId;
      console.log('Edit Row', JSON.stringify(this.row));
      this.clientform.patchValue({
        orgId: this.row.orgId, organization: this.row.organization, emailId: this.row.emailId,
        mobileNo: this.row.mobileNo,//this.row.mobileNo.startsWith('+') ? this.row.mobileNo : '+' + this.row.mobileNo,
        address: this.row.address, logoPath: this.row.logoPath
      });
      this.cdrf.detectChanges();
      this.hideButton = false;
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  validate(file) {
    this.loading = true;
    this.FileData = [];
    const frmData = new FormData();
    frmData.append('file', this.fileList[0]);
    this._clientserv.valdiateAndReadData(frmData).subscribe((response: IValidate) => {
      if (response) {
        if (response.validationStatus === 'LICENSE_VALID') {
          this.submitbtn1 = true;
          this.validLicense = true;
          this.inValidLicense = false;
          this.clientform.get('licensePath').setValue(response.licenseFilePath);
          console.log('Validate Response', response);
          console.log("count :: " + response.hospitalsCount)
          this.message = response.hospitalsCount;
          this.hospitalList = response.hospitals;
        } else {
          this.inValidLicense = true;
          this.validLicense = false;
          this.submitbtn1 = false;
          this.message = undefined;
        }
      } else {
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  validatelogo() {
    this.FileData = [];
    const frmData = new FormData();
    frmData.append('file', this.fileList[0]);
    console.log("frmData=>", frmData, this.fileList[0]);
    this.loading = true;
    this._clientserv.uplaodLogoFile(frmData).subscribe((response: IUpload) => {
      if (response.status === true) {
        this.submitbtn = true;
        this.validLogo = true;
        this.inValidLogo = false;
        this.clientform.get('logoPath').setValue(response.filePath);
        console.log('Validate Response', response);
      } else {
        this.inValidLogo = true;
        this.validLogo = false;
        this.showAlert(response.messages, ActionType.ERROR);
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

  FileUpload(event, action) {
    this.hideButton = true;
    let fileList1: FileList;
    this.fileList = fileList1;
    this.fileList = event.target.files;
    console.log("frmData=>1", event.target.files, this.fileList[0],event);
    console.log('In Lincense upload event.target.files[0] :: ', JSON.stringify(event.target)
    );

    if (this.fileList.length > 0) {
      const file: File = this.fileList[0];
      const extension = (file.name as string).split('.').pop();
      if (action) {
        if (extension !== 'l4j') {
          this.showAlert(this.translate.instant('ClientsModule.fileExtension'), ActionType.ERROR);
        } else {
          // this.imageSrc = event.target.result;
          this.validate(file);
        }
      }
      else {
        if (event.target.files && event.target.files[0]) {
          const reader: FileReader = new FileReader();
          reader.onload = (event: any) => {
            this.imageSrc = event.target.result;
            //console.log("imageSrc :: ", this.imageSrc);
          }
          reader.readAsDataURL(event.target.files[0]);
        }
        this.validatelogo();
      }
    }
  }

  closeImg() {
    this.imageSrc = '';
    this.clientform.get('logoPath').setValue('');
    this.inValidLogo = false;
    this.validLogo = false;
  }

  onSubmit() {
    this.loading = true;
    if (this.clientform.get('orgId').value === 0 || this.clientform.get('orgId').value === (null || undefined || '')) {
      console.log('File Paths =>', this.clientform.value.logoPath, this.clientform.value.licensePath);
      this.btnSubmitDisaable = true;
      const data = this.clientform.value;
      // data.mobileNo = (data.mobileNo as string).replace('+', '').replace(' ', '');
      data.organization = (data.organization as string).trim();
      console.log('submit value=>', data);
      this._clientserv.createClient(data).subscribe((response: IResponse) => {
        if ((response as any).status) {
          console.log('Response =>', JSON.stringify(response));
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(true);
          // this.clearControls();
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          const message = error.error.messages as string;
          const errorMessage = error.status === 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log('Failed :: ', JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    } else {
      const data = this.clientform.value;
      // data.mobileNo = (data.mobileNo as string).replace('+', '').replace(' ', '');
      console.log('submit value=>', data);
      this._clientserv.updateClientInfo(data).subscribe((response: IResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
        }
        this.clearControls();
        this.loading = false;
      },
        error => {
          let message = error.error.messages as string;
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log('Failed :: ', JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    }
  }

  clearControls() {
    this.imageUrlShow = false;
    this.imageSrc = '';
    this.clientform.get('logoPath').setValue('');
    this.inValidLogo = false;
    this.validLogo = false;
    this.dialogRef.close(true);
  }
}