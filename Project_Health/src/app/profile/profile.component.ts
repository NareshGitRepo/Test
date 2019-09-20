import { ActionType, AlertMessageService } from "../_services/alertMessageService";
import { AppConfig, ITokenInfo, IUserUpdateDto } from "../_helpers/app.config";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";

import { ErrorStateMatcher } from "@angular/material";
import { IProfileResponse } from "./_model/profile.model";
import { ProfileService } from "./_service/profile.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

declare var $: any;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  url = "assets/images/user.png";
  myform: FormGroup;
  passwordForm: FormGroup;
  firstname: FormControl;
  lastname: FormControl;
  contactNo: FormControl;
  language: FormControl;
  _tokenInfo: IUserUpdateDto;
  _roleName: string;
  showEditProfile: boolean = false;
  language_select: string = "en";
  country: string;
  matcher = new MyErrorStateMatcher();
  hide: boolean = false;
  hide2: boolean = false;
  hide3: boolean = false;
  changePassFlag: boolean = true;
  constructor(private _profileService: ProfileService, private fb: FormBuilder, private appconfig: AppConfig,
    private router: Router, private translate: TranslateService, private alertMessage: AlertMessageService) {
    // this.country=this.appconfig.getCountry();
    console.log("constructor");
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData) {
      this._tokenInfo = tokenData.tokenSub;
      console.log("this._tokenInfo :: ", this._tokenInfo);
    }

    if (this._tokenInfo && tokenData) {
      this._roleName = this._tokenInfo.roles[0].roleName;
      this.changePassFlag = this._tokenInfo.userType == '1' ? false : true;
      // if (this._roleName != userType.SuperAdmin)
      //   this._orgid = this._tokenInfo.organizations[0].orgId;
    } else this.router.navigate(["401"]);
  }

  ngOnInit() {


    this.myform = this.fb.group({
      userId: [""],
      firstname: ["",[ Validators.required, Validators.minLength(1)],[this.appconfig.UserMinValidator(1)]],
      lastname: ["",[ Validators.required, Validators.minLength(1)],[this.appconfig.UserMinValidator(1)]],
      contactNo: ["",[Validators.required]],
      language: [""]
    });

    this.passwordForm = this.fb.group({
      //userId: [""],
      oldpswd: ["", Validators.required],
      newpswd: ["", Validators.required],
      cnfmpswd: ["", Validators.required]
    }, { validator: this.checkPasswords }
      // }
    );

  }


  editForm() {
    this.showEditProfile = true;

    this.myform.setValue({
      userId: this._tokenInfo.userId,
      firstname: this._tokenInfo.firstname,
      lastname: this._tokenInfo.lastname,
      contactNo: this._tokenInfo.contactNo,
      language: this._tokenInfo.language
    });
  }

  updateProfile() {
    console.log(" myform :: ", this.myform.value);
    this._profileService.updateProfileById(this.myform.value).subscribe(
      (response: IProfileResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          //this.clearForm();
          this.showEditProfile = false;
          //this.myform.reset();
        } else {
          this.passwordForm.reset();
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  changePassword() {
    console.log(" passwordForm :: ", this.passwordForm.value);
    const data = this.passwordForm.value;
    data.userId = this._tokenInfo.userId;
    this._profileService.changePassword(data).subscribe(
      (response: IProfileResponse) => {
        if (response) {
          console.log("response of  changePassword :: ", response);
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          //  this.clearForm();
          this.passwordForm.reset();
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
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

  closeForm() {
    this.showEditProfile = false;
  }

  // clearForm() {
  //   this.myform.reset();
  //   this.passwordForm.reset();
  // }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newpswd.value; console.log('pass', pass)
    let confirmPass = group.controls.cnfmpswd.value; console.log('confirmPass', confirmPass)
    return pass === confirmPass ? null : { notSame: true }
  }
}
