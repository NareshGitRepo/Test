import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormGroupDirective, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IUpdateProfile, IProfileResponse, IChangePassword } from '../_model/profileModel';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { ProfileService } from '../_service/profileService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType } from '../../_services/AlertMessageService';
import { AppConfig, IUserUpdateDto, ITokenInfo, ILoginDtos } from '../../_helpers/app.config';
import { ProfileConfirmComponent } from '../_model/profileconfirm.component';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  _profileForm: FormGroup;
  passwordForm: FormGroup;
  _updateProfile: IUpdateProfile;
  showEditProfile: boolean = false;
  matcher = new MyErrorStateMatcher();
  loading: boolean = false;
  passwordHide: boolean = false;
  cnfPasswordHide: boolean = false;
  repasswordHide: boolean = false;
  tokenInfo: ITokenInfo;
  loginDtos: ILoginDtos;
  loginInfo: IUserUpdateDto
  constructor(private _profileService: ProfileService, private fb: FormBuilder, private appconfig: AppConfig,
    private router: Router, private translate: TranslateService, private alertMessage: AlertMessageService, private dialog: MatDialog) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      let newLoginDtos: ILoginDtos
      this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
    } else {
      this.router.navigate(['401']);
    }

    console.log("LOGIN==>", this.loginInfo);
  }

  ngOnInit() {
    this._profileForm = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null],
      mobileNo: [null, Validators.required],
      language: [null],
      userId: [null]
    });
    this.passwordForm = this.fb.group({
      oldpswd: [null, Validators.required],
      newpswd: [null, Validators.required],
      cnfmpswd: [null, Validators.required]
    }, { validator: this.checkPasswords }
    );
  }

  editProfileForm() {
    this.showEditProfile = true;
    this._profileForm.setValue({
      firstname: this.loginInfo.firstname,
      language: this.loginInfo.language,
      lastname: this.loginInfo.lastname,
      mobileNo: this.loginInfo.mobileNo,
      userId: this.loginInfo.userId,
    });
  }
  updateProfile() {
    this.loading = true;
    this._updateProfile = {
      firstname: this._profileForm.value.firstname,
      language: this._profileForm.value.language,
      lastname: this._profileForm.value.lastname,
      mobileNo: this._profileForm.value.mobileNo,
      userId: this._profileForm.value.userId
    }
    this._profileService.updateProfileById(this._updateProfile).subscribe(
      (response: IProfileResponse) => {
        console.log("UPDATE==>" + JSON.stringify(this._updateProfile));
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.showEditProfile = false;
        } else {
          this.passwordForm.reset();
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-updateProfile==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  changePassword() {
    this.loading = true;
    let IChangePass = {
      newpswd: (this.passwordForm.value.newpswd as string).trim(),
      oldpswd: (this.passwordForm.value.oldpswd as string).trim(),
    } as IChangePassword;
    this._profileService.changePassword(IChangePass).subscribe((response: IProfileResponse) => {
      if (response) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.passwordForm.reset();
      } else {
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        console.error("E-changePassword==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  updateApiKey() {
    const dialogRef = this.dialog.open(ProfileConfirmComponent, {
      width: '500px',
      data: this.translate.instant('profileModule.confirmMessage')
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this._profileService.updateUserApiKey().subscribe((response: IProfileResponse) => {
          if (response) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.passwordForm.reset();
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        },
          error => {
            let message = error.error.messages as string;
            let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
            console.error("E-updateApiKey==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
  checkPasswords(group: FormGroup) {
    let pass = group.controls.newpswd.value;
    let confirmPass = group.controls.cnfmpswd.value;
    if (pass && confirmPass != null)
      return pass === confirmPass ? null : { notSame: true }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  closeForm() {
    this.showEditProfile = false;
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
