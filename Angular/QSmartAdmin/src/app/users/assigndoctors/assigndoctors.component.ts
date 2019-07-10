import { Component, OnInit, Inject } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IGetUser, IUser, IDeptData, IMapNurse, Doctor, IUserResponse } from '../_model/IUsers';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../_service/users.service';
import { AppConfig } from '../../_helpers/app.config';
import { AlertMessageService, ActionType } from '../../_services/alertMessageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assigndoctors',
  templateUrl: './assigndoctors.component.html',
  styleUrls: ['./assigndoctors.component.scss']
})
export class AssigndoctorsComponent implements OnInit {

  DoctorsList: IUser[] = [];
  selectDoctorList: IUser[] = [];
  _tokenInfo: any;
  key: string = 'firstname';
  display: any;
  format: any = DualListComponent.DEFAULT_FORMAT;
  usersForm: FormGroup;
  loading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public editData: IGetUser, public dialogRef: MatDialogRef<AssigndoctorsComponent>, private alertMessage: AlertMessageService, private appconfig: AppConfig, private translate: TranslateService, private fb: FormBuilder,
    private userService: UsersService,private router: Router) {
    console.log('assignContacts=>', editData);
  }

  ngOnInit() {
    this.format = {
      add: this.translate.instant('ActionNames.dualListAdd'),
      remove: this.translate.instant('ActionNames.dualListRemove'),
      all: this.translate.instant('ActionNames.dualListAll'),
      none: this.translate.instant('ActionNames.dualListNone'),
    };
    this.usersForm = this.fb.group({
      login: [null, [Validators.required, Validators.email]],
    });
    this.display = this.stationLabel;
    if (this.editData) {
      this.usersForm.get('login').setValue(this.editData.login);
      let deptcollection = [];
      let departmentData: IDeptData;
      this.editData.depts.forEach(data => {
        deptcollection.push(data.deptId);
      });
      departmentData = { "deparements": deptcollection }
      this.loading = true;
      // this.userService.getDoctorsByDeptId(departmentData).subscribe((response: IUser[]) => {
      //   this.DoctorsList = response;
      //   this.selectDoctorList = this.DoctorsList.filter(data => this.editData.doctors.findIndex(x => x.userId == data.userId) != -1);
      // })
      this.loading = false;
    }

  }
  private stationLabel(item: any) {
    return item.firstname;
  }

  assignDoctors() {
    let doctorCollection: Doctor[] = [];
    let assignData: IMapNurse;
    this.selectDoctorList.forEach(data => {
      doctorCollection.push({ firstname: data.firstname, userId: data.userId })
    });
    assignData = { "doctors": doctorCollection, "userId": this.editData.userId }
    console.log(JSON.stringify(assignData));
    this.loading = true;
    this.userService.mapNurseDoctors(assignData).subscribe((response: IUserResponse) => {
      if (response) {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        this.dialogRef.close(assignData);
      } else {
        this.alertMessage.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR,error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
