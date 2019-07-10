import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IGetUser, IDepartment, Floor, IMDepartment, IUserResponse, ICreateDepartment, ICreateDepartments, IMService } from '../_model/IUsers';
import { UsersService } from '../_service/users.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manualtokencreate',
  templateUrl: './manualtokencreate.component.html',
  styleUrls: ['./manualtokencreate.component.scss']
})
export class ManualtokencreateComponent implements OnInit {


  manualForm: FormGroup;
  departments: IDepartment[] = [];
  selectdepartments: IDepartment[] = [];
  serviceList: IMService[] = [];
  getMDepartment: IMDepartment[] = [];
  displayDepartement: string = '';
  displayService: string = '';
  loading: boolean = false;
  global: any;
  submitAction: boolean = false;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ManualtokencreateComponent>, @Inject(MAT_DIALOG_DATA) private data: IGetUser,
    private service: UsersService, private translate: TranslateService, private alertMessage: AlertMessageService, private router: Router,
  ) {

  }

  ngOnInit() {
    this.manualForm = this.fb.group({
      department: [null, Validators.required],
      service: [null, Validators.required]
    });
    this.getLevelsInfo(false);
  }

  getLevelsInfo(action?: boolean) {
    this.loading = true;
    this.service.getlevelsDeptSeviceInfo().subscribe((response: Floor[]) => {
      console.log("LEVELRESPONSE==>", response, this.data.levelId);
      if (response) {
        let indx = response.findIndex(con => con.floorId == this.data.levelId);
        if (indx != -1) {
          this.departments = response[indx].departments.filter(x => x.deptType != 0);
          if (this.departments.length == 0)
            this.showAlert(this.translate.instant('usersModule.manualtokencreate.deptError'), ActionType.ERROR);
          this.service.getDeptSeviceInfo(this.data.userId).subscribe((response: IMDepartment[]) => {
            this.getMDepartment = response;
            console.log("LevelResponse==>", response);
            if (response.length > 0) {
              this.submitAction = true;
              let editDepartement = [];
              response.forEach(data => {
                editDepartement.push(data.deptId);
              });
              if (editDepartement.length > 0) {
                this.manualForm.get('department').setValue(editDepartement);
                this.changeDepartment(editDepartement, false);
              }
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
        }
        else
          this.showAlert(this.translate.instant('usersModule.manualtokencreate.deptError'), ActionType.ERROR);
      }
      else
        this.showAlert(this.translate.instant('usersModule.manualtokencreate.levelError'), ActionType.ERROR);
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  changeDepartment(department, action?: boolean) {
    this.loading = true;
    this.displayDepartement = '';
    this.displayService = '';
    if (department.length > 0) {
      this.manualForm.get('department').setValidators(Validators.required);
      this.manualForm.get('service').setValidators(Validators.required);
      this.manualForm.updateValueAndValidity();
      let indx = this.departments.findIndex(con => con.deptId == department[0]);
      if (indx != -1)
        this.displayDepartement = this.departments[indx].deptName;
      console.log('departments=>', this.displayDepartement);
    }
    else {
      if (this.submitAction) {
        this.manualForm.get('department').clearValidators();
        this.manualForm.get('service').clearValidators();
        this.manualForm.get('department').updateValueAndValidity();
        this.manualForm.get('service').updateValueAndValidity();
      }
      else {
        this.manualForm.get('department').setValidators(Validators.required);
        this.manualForm.get('service').setValidators(Validators.required);
        this.manualForm.get('department').updateValueAndValidity();
        this.manualForm.get('service').updateValueAndValidity();
      }
    }
    this.selectdepartments = this.departments.filter(con => department.findIndex(z => z == con.deptId) != -1);
    if (!action) {
      this.displayService = '';
      let serviceIds = [];
      this.getMDepartment.filter(con => department.findIndex(z => z == con.deptId) != -1).forEach(t => {
        t.services.forEach(s => {
          this.displayService = this.displayService == '' ? s.serviceEngName : this.displayService;
          serviceIds.push(s.serviceId);
        });
      });
      console.log('SelectedDepartment=>', department, this.selectdepartments);
      if (serviceIds.length > 0)
        this.manualForm.get('service').setValue(serviceIds);
    }
    else
      this.manualForm.get('service').setValue(null);
    this.loading = false;
  }
  changeService(services) {
    this.loading = true;
    this.displayService == '';
    let department = this.manualForm.value.department != null ? this.manualForm.value.department : [];
    if (department.length > 0 && services.length > 0) {
      let deprtmentdata = this.selectdepartments.filter(x => x.services.findIndex(y => y.serviceId == services[0]) != -1);
      if (deprtmentdata.length > 0) {
        let servicedata = deprtmentdata[0].services;
        let indx = servicedata.findIndex(con => con.serviceId == services[0]);
        if (indx != -1)
          this.displayService = servicedata[indx].serviceEngName;
        console.log('Services=>', this.displayService);
      }
    }
    this.loading = false;
  }

  createManualToken() {
    this.loading = true;
    console.log("Submit==>", this.manualForm.value.department, this.manualForm.value.service);
    let departmentCollections: ICreateDepartment[] = [];
    let totalDept = this.manualForm.value.department;
    for (var i = 0; i < totalDept.length; i++) {
      departmentCollections.push({ deptId: totalDept[i] });
    }
    let serviceCollections: IMService[] = [];
    let totalServices = this.manualForm.value.service == null ? [] : this.manualForm.value.service;
    for (var i = 0; i < totalServices.length; i++) {
      serviceCollections.push({ serviceId: totalServices[i] })
    }
    let manualDept = {
      departments: departmentCollections,
      userid: this.data.userId,
      services: serviceCollections
    } as ICreateDepartments;
    console.log('manualDept=>' + JSON.stringify(manualDept));
    this.service.CreateManualDepartment(manualDept).subscribe((response: IUserResponse) => {
      if (response.status) {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        this.dialogRef.close(manualDept);
      } else {
        this.alertMessage.showAlert(response.messages, ActionType.FAILED);
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}