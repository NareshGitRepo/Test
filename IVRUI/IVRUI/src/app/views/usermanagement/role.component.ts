import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Page } from "../../beans/page";
import { GlobalConfig, ToastrService } from "ngx-toastr";
import { RoleService } from "../../services/usermanagement/role.service";
import { Role } from "../../beans/usermanagement/role";
import { NgForm } from "@angular/forms";

const types = ["success", "error", "info", "warning"];

@Component({
  templateUrl: "role.component.html"
})

export class RoleComponent implements OnInit {

  ngForm: any;
  roleId: any;
  showResponse: boolean = false;
  public roleInfo: Role[];
  page = new Page();
  rows = new Array<Role>();
  temp = [];

  @ViewChild("primaryModal") myModal;

  popupMessage: string;
  model: any = {};
  placements: string[] = ["top"];
  popoverTitle = "Are you sure?";
  addPopoverMessage = "Are you sure, really want to remove this Role?";
  popoverMessage = "Are you sure, really want to add this number?";
  confirmText = "Yes <i class=\"glyphicon glyphicon-ok\"></i>";
  cancelText = "No <i class=\"glyphicon glyphicon-remove\"></i>";
  confirmClicked = false;
  cancelClicked = false;
  public loading = false;
  public rolestatus = 0;
  roleName: any;
  id: any;
  roleExist: boolean = false;

  constructor(private router: Router, private service: RoleService, private toastr: ToastrService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    console.log("RoleComponent:ngOnInit:");
    this.getRoleInfo();
  }

  onSearchRole() {
    console.log("RoleComponent:onSearchRole:" + this.model.roleName);
    this.service.getRoleName(this.model.roleName).subscribe((response) => {
      console.log("Respopnse :::>" + response.status);
      if (response.status) {
        // this.toastr.success("", "Failed");
        this.roleExist = false;
      } else {
        // this.toastr.error(this.model.roleName + " " + response.message, "Failed");
        // this.model.roleName = "";
        this.roleExist = true;
      }
    });
  }

  removeClick(row) {
    console.log("RoleComponent:removeClick:");
    console.log("Role Name : --> ", row.roleName);
  }

  doAddAction() {
    console.log("RoleComponent:doAddRole:");
    this.showResponse = true;
    this.model.roleName = "";
    this.rolestatus = 1;
    this.myModal.show();
  }

  doSaveAction(form: NgForm) {
    console.log("RoleComponent:doSaveAction:");
    this.showResponse = true;
    this.roleName = this.model.roleName;
    console.log("RoleComponent:doSaveAction :RoleName " + this.roleName);
    this.addRemoveAction(this.roleName, "add");
    this.myModal.hide();
    form.reset();
  }

  doEditAction(row) {
    this.showResponse = false;
    this.rolestatus = 2;
    console.log("RoleComponent:doEditAction:" + row.roleName);
    this.roleId = row.roleId;
    this.model.roleName = row.roleName;
    this.myModal.show();
  }

  doUpdateAction(form: NgForm) {
    this.showResponse = true;
    console.log("RoleComponent:doUpdateAction:" + this.id + "::" + this.model.roleName);
    // this.loading = true;
    this.updateAction(this.roleId, this.model.roleName, "update");
    this.myModal.hide();
    form.reset();
    this.getRoleInfo();
  }

  doDeleteAction(row) {
    console.log("RoleComponent:doDeleteAction:" + row.roleId);
    // this.loading = true;
    this.deleteAction(row.roleId, row.roleName, "delete");
    this.getRoleInfo();
  }

  addRemoveAction(rolename, action) {
    console.log("RoleComponent:addRemoveAction:");
    console.log("Role Name : ", rolename);
    this.service.addRemoveService(rolename, action).subscribe(response => {
      console.log("addRemoveAction Response : ", response);
      console.log("addRemoveAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(rolename + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(rolename + " " + response.message, "Failed");
      }
    });
    this.getRoleInfo();
  }

  updateAction(id, rolename, action) {
    console.log("RoleComponent:updateAction:");
    console.log("Role Name : ", rolename);
    this.service.updateService(id, rolename, action).subscribe(response => {
      console.log("updateAction Response : ", response);
      console.log("updateAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(rolename + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(rolename + " " + response.message, "Failed");
      }
    });
    this.getRoleInfo();
  }

  deleteAction(id, rolename, action) {
    console.log("RoleComponent:deleteAction:");
    console.log("Role Name : ", rolename);
    this.service.updateService(id, rolename, action).subscribe(response => {
      console.log("deleteAction Response : ", response);
      console.log("deleteAction Result : ", response.status);
      if (response.status) {
        console.log("Success");
        this.toastr.success(rolename + " " + response.message, "Success");
      } else {
        console.log("Failed");
        this.toastr.error(rolename + " " + response.message, "Failed");
      }
    });
    this.getRoleInfo();
  }

  getRoleInfo() {
    console.log("RoleComponent:getRoleInfo:");
    this.roleInfo = [];
    // this.loading = true;
    this.service.getRoleInfo().subscribe(data => {
      // console.log("RoleComponent Data : ", data);
      this.roleInfo = data;
      this.loading = false;
      console.log("Queues Length : ", this.roleInfo.length);
      this.temp = [...this.roleInfo];
      this.setPage({ offset: 0 });
    });
  }

  setPage(pageInfo) {
    console.log("RoleComponent:setPage:");
    this.page.pageNumber = pageInfo.offset;
    this.service.getResults(this.page, this.roleInfo).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      // console.log("Rows : ", this.rows);
    });
  }
}
