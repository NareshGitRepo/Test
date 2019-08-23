import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserComponent } from "./user.component";
import { RoleComponent } from "./role.component";


const routes: Routes = [
  {
    path: "",
    data: {
      title: "UserManagement"
    },
    children: [
      {
        path: "user",
        component: UserComponent,
        data: {
          title: "User"
        }
      },{
        path: "role",
        component: RoleComponent,
        data: {
          title: "Role"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
