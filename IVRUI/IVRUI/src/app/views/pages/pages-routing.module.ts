import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { P401Component } from "./401.component";
import { P404Component } from "./404.component";
import { P500Component } from "./500.component";
import { P599Component } from "./599.component";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";


const routes: Routes = [
  {
    path: "",
    data: {
      title: "Example Pages"
    },
    children: [
      {
        path: "401",
        component: P401Component,
        data: {
          title: "Page 401"
        }
      },
      {
        path: "404",
        component: P404Component,
        data: {
          title: "Page 404"
        }
      },
      {
        path: "500",
        component: P500Component,
        data: {
          title: "Page 500"
        }
      },
      {
        path: "599",
        component: P599Component,
        data: {
          title: "Page 599"
        }
      },
      {
        path: "login",
        component: LoginComponent,
        data: {
          title: "Login Page"
        }
      },
      {
        path: "register",
        component: RegisterComponent,
        data: {
          title: "Register Page"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
