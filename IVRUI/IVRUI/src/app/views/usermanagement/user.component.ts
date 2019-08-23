import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Page } from "../../beans/page";
import { GlobalConfig, ToastrService } from "ngx-toastr";
import { SelectModule } from 'ng2-select';
import { UserService } from "../../services/usermanagement/user.service";
import { User } from "../../beans/usermanagement/user";
import { RoleService } from "../../services/usermanagement/role.service";
import { Role } from "../../beans/usermanagement/role";
import { NgForm } from "@angular/forms";

const types = ["success", "error", "info", "warning"];

@Component({
  templateUrl: "user.component.html"
})

export class UserComponent implements OnInit {

  userExist: boolean=false;
  roleId: any;
  showResponse: boolean = false;
  public userInfo: User[];
  page = new Page();
  rows = new Array<User>();
  temp = [];

  @ViewChild("primaryModal") myModal;

  popupMessage: string;

  model: any = {};
  placements: string[] = ["top"];
  popoverTitle = "Are you sure?";
  addPopoverMessage = "Are you sure, really want to remove this user?";
  popoverMessage = "Are you sure, really want to add this number?";
  confirmText = "Yes <i class=\"glyphicon glyphicon-ok\"></i>";
  cancelText = "No <i class=\"glyphicon glyphicon-remove\"></i>";
  confirmClicked = false;
  cancelClicked = false;
  public loading = false;
  public userstatus = 0;

  staus: string;
  validRole: boolean = false;
  validStatus: boolean = false;
  status: string;
  type = types[0];
  listRoles: any;
  listStatus: any;
  userName: any;
  password: any;
  confirmPassword: any;
  role: any;
  email: any;
  phoneNumber: any;
  id: any;
  isEdit = false;

  public roleInfo: Role[];

  constructor(private router: Router, private service: UserService, private roleservice: RoleService, private toastr: ToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    console.log("UserComponent:ngOnInit:");
    this.model.role = "Select";
    this.model.status = "Select";
    this.getRoleInfo();
    this.getUserInfo();
  }

  closeWindow() {
    console.log("UserComponent:closeWindow");
    this.myModal.hide();
    this.model.status = "Select";
    this.model.roleId = 0;
    this.model.userName = "";
    this.model.password = "";
    this.model.confirmPassword = "";
    this.model.email = "";
    this.model.phoneNumber = "";
  }

  getRoleInfo() {
    console.log("UserComponent:getRoleInfo:");
    this.roleInfo = [];
    this.roleservice.getRoleInfo().subscribe(data => {
      console.log("UserComponent :Role Data : ", data);
      // this.roleInfo.push({ "roleId": 0, "roleName": "Select", "createdBy": "admin", "updatedBy": "admin" });
      this.roleInfo = data;
      this.roleInfo = [{ "roleId": 0, "roleName": "Select", "createdBy": "", "updatedBy": "" },...this.roleInfo];
    });
  }

  removeClick(row) {
    console.log("UserComponent:removeClick:");
    console.log("UserName : --> ", row.userName);
  }

  doAddAction() {
    console.log("UserComponent:addUser:");
    this.myModal.show();
    this.showResponse = true;
    this.userstatus = 1;
    this.model.roleId = 0;
    this.isEdit = false;
    this.model.status = "Select";
    this.model.userName = "";
    this.model.password = "";
    this.model.confirmPassword = "";
    this.model.email = "";
    this.model.phoneNumber = "";
  }

  doSaveAction(form : NgForm) {
    console.log("UserComponent:doSaveAction:");
    this.showResponse = true;
    this.userName = this.model.userName;
    this.password = this.model.password;
    this.role = this.model.roleId;
    this.email = this.model.email;
    this.phoneNumber = this.model.phoneNumber;
    this.status = this.model.status;
    console.log("UserComponent:doSaveAction :userName " + this.userName + this.status);
    this.addRemoveAction(this.userName, this.password, this.role, this.email, this.phoneNumber, this.status, "add");
    this.myModal.hide();
    form.reset();
    // this.getUserInfo();
  }

   onSearchUser() {
    console.log("UserComponent:onSearchUser:" + this.model.userName);
    this.service.getUserName(this.model.userName).subscribe((response) => {
      console.log("Response :::>" + response.status);
      if (response.status) {
        // this.toastr.success("", "Failed");
        this.userExist = false;
      } else {
        // this.toastr.error(this.model.userName + " " + response.message, "Failed");
        this.userExist = true;
      }
    });
  }

  doEditAction(row) {
    console.log("UserComponent:doEditAction:");
    this.showResponse = false;
    this.userstatus = 2;
    this.id = row.id;
    this.isEdit = true;
    this.validRole = true;
    this.validStatus = true;
    this.model.confirmPassword = null;
    this.model.userName = row.userName;
    this.model.password = row.password;
    this.model.roleId = row.roleId;
    this.model.email = row.email;
    this.model.phoneNumber = row.phoneNumber;
    this.model.status = row.status;

    console.log("UserComponent:doEditAction:" + row.id + "  " + row.userName + "  " + row.password + "  " +
      row.roleId + "  " + row.email + "  " + row.phoneNumber + "  " + row.status);
    this.myModal.show();
  }

  doUpdateAction(form : NgForm) {
    this.showResponse = true;
    console.log("UserComponent:doUpdateAction:" + this.userName);
    // this.loading = true;
    this.updateAction(this.id, this.model.userName, this.model.password, this.model.roleId, this.model.email, this.model.phoneNumber, this.model.status, "update");
    this.myModal.hide();
    form.reset();
    this.getUserInfo();
  }

  doDeleteAction(row) {
    console.log("UserComponent:doDeleteAction:" + row.userName + " " + row.id);
    // this.loading = true;
    this.deleteAction(row.id, row.userName, row.password, row.roleId, row.email, row.phoneNumber, row.status, "delete");
    this.getUserInfo();
  }

  addRemoveAction(userName, password, role, email, phoneNumber, status, action) {
    console.log("UserComponent:addRemoveAction:");
    console.log("User Name : ", userName);
    console.log("password : ", password);
    console.log("role : ", role);
    console.log("email : ", email);
    console.log("phoneNumber : ", phoneNumber);
    console.log("status : ", status);

    this.service.addRemoveService(userName, password, role, email, phoneNumber, status, "add").subscribe(response => {
      console.log("addRemoveAction Response : ", response);
      console.log("addRemoveAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(userName + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(userName + " " + response.message, "Failed");
      }
    });
    this.getUserInfo();
  }

  updateAction(id, userName, password, role, email, phoneNumber, status, action) {
    console.log("UserComponent:updateAction:");
    console.log("Id : ", id);
    console.log("User Name : ", userName);
    console.log("password : ", password);
    console.log("role : ", role);
    console.log("email : ", email);
    console.log("phoneNumber : ", phoneNumber);
    console.log("status : ", status);

    this.service.updateService(id, userName, password, role, email, phoneNumber, status, action).subscribe(response => {
      console.log("updateAction Response : ", response);
      console.log("updateAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(userName + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(userName + " " + response.message, "Failed");
      }
    });
    this.getUserInfo();
  }

  deleteAction(id, userName, password, role, email, phoneNumber, status, action) {
    console.log("UserComponent:updateAction:");
    console.log("User Info : ", id, userName, password, role, email, phoneNumber, status);
    this.service.updateService(id, userName, password, role, email, phoneNumber, status, action).subscribe(response => {
      console.log("updateAction Response : ", response);
      console.log("updateAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(userName + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(userName + " " + response.message, "Failed");
      }
    });
    this.getUserInfo();
  }

  selectRole(event) {
    console.log("UserComponent:selectRole:", event);
    if (event.roleId === 0) {
      this.validRole = false;
    } else {
      this.validRole = true;
    }
  }

  selectStatus(event) {
    console.log("UserComponent:selectStatus:", event);
    if (event === 'Select') {
      this.validStatus = false;
    } else {
      this.validStatus = true;
    }
  }

  getUserInfo() {
    console.log("UserComponent:doSearchAction:");
    console.log("UserComponent:doSaveAction :UserName " + this.userName);
    this.userInfo = [];
    //this.loading = true;
    this.service.getUsersInfo(this.userName).subscribe(data => {
      // console.log("UserComponent Data : ", data);
      this.userInfo = data;
      this.loading = false;
      console.log("Queues Length : ", this.userInfo.length);
      this.temp = [...this.userInfo];
      this.setPage({ offset: 0 });
    });
  }

  setPage(pageInfo) {
    console.log("UserComponent:setPage:");
    this.page.pageNumber = pageInfo.offset;
    this.service.getResults(this.page, this.userInfo).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      // this.temp = [...pagedData.data];
      // console.log("Rows : ", this.rows);
    });
  }
}
