import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserActions, ILoginDto, IUser, IResponse } from '../_model/usermodel';
import { UserService } from '../_services/_user.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-useractions',
  templateUrl: './useractions.component.html',
  styleUrls: ['./useractions.component.scss']
})
export class UserActionsComponent implements OnInit {

  public deleteAction: boolean = false;
  public activateAction: boolean = false;
  public inActivateAction: boolean = false;
  public resetPasswordAction: boolean = false;

  public _userdata: IUser;
  loading: boolean = false;

  constructor(private dialogRef: MatDialogRef<UserActionsComponent>,
    private userService: UserService, private alertMessage: AlertMessageService, private translate: TranslateService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {



    this._userdata = data.data;

    switch (this.data.action) {
      case UserActions.DELETE:
        this.deleteAction = true;
        break;
      case UserActions.ACTIVE:
        this.activateAction = true;
        break;
      case UserActions.INACTIVE:
        this.inActivateAction = true;
        break;
      case UserActions.RESET_PASSWROD:
        this.resetPasswordAction = true;
        break;
    }
  }

  ngOnInit() {
  }

  onDeleteUser() {
    this.loading = true;
    this.userService.deleteUserStatus(this._userdata.userId).subscribe((response: IResponse) => {
      if (response) {
        console.log("Response==>", response);
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.loading = false;
        this.dialogRef.close(true);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onDeleteUser==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  onResetpwdStatus() {
    console.log('onResetpwdStatus :', this._userdata);
    this.userService.resetPwdUser(this._userdata.userId).subscribe(response => {
      if (response.status === true) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.dialogRef.close(true);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onResetpwdStatus==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  onDeactivateUser() {
    this.loading = true;
    this.userService.updateUserStatus(this._userdata.userId, 0).subscribe((response: IResponse) => {
      if (response) {
        console.log("Response==>", response);
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.loading = false;
        this.dialogRef.close(true);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onDeactivateUser==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  onActivateUser() {
    this.loading = true;
    this.userService.updateUserStatus(this._userdata.userId, 1).subscribe((response: IResponse) => {
      if (response) {
        console.log("Response==>", response);
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.loading = false;
        this.dialogRef.close(true);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onActivateUser==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  onNoClick() {
    console.log('onNoClick :');
    this.dialogRef.close(false);
  }

}
