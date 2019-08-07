import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Router } from '@angular/router';
import { ITokenInfo, ILoginDtos, IUserUpdateDto, AppConfig } from '../../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { LoginService } from '../../_service/login.service';
import { IChangePassword, IChangeResponse, logoutResponse } from '../../_models/login';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  passwordForm: FormGroup;
  cnfPasswordHide: boolean = false;
  repasswordHide: boolean = false;
  loading: boolean = false;
  success: Boolean = false;
  tokenInfo: ITokenInfo;
  loginDtos: ILoginDtos;
  loginInfo: IUserUpdateDto
  matcher = new MyErrorStateMatcher();
  constructor(private fb: FormBuilder, private appconfig: AppConfig,
    private router: Router, private translate: TranslateService, private alertMessage: AlertMessageService, private service: LoginService) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    console.log("LOGIN==>", this.tokenInfo, this.router.url);
    if (this.tokenInfo && this.router.url != '/vmcp') {
      let newLoginDtos: ILoginDtos
      this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
    } else {
      this.router.navigate(['401']);
    }


  }

  ngOnInit() {
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
    this.passwordForm = this.fb.group({
      newpswd: [null, Validators.required],
      cnfmpswd: [null, Validators.required]
    }, { validator: this.checkPasswords }
    );
  }

  redirectLogin() {
    this.service.logout().subscribe((x: logoutResponse) => {
      if (x.status) {
        localStorage.clear();
        this.appconfig.clearTokenInfo();
        this.router.navigate(['']);
      }
      else {
        this.showAlert(x.messages, ActionType.ALERT);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR);
    });
  }
  ChangePassword() {
    this.success = false;
    this.loading = true;
    let IChangePass = {
      password: (this.passwordForm.value.newpswd as string).trim(),
    } as IChangePassword;
    this.service.changePassword(IChangePass).subscribe((response: IChangeResponse) => {
      if (response) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.success = true;
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.newpswd.value;
    let confirmPass = group.controls.cnfmpswd.value;
    if (pass && confirmPass != null)
      return pass === confirmPass ? null : { notSame: true }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}