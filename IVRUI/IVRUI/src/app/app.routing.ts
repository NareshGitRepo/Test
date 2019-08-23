import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./guards/auth.guard";

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from "./containers";

import { NgxPermissionsGuard } from "ngx-permissions";

export const routes: Routes = [
  {
    path: "",
    // redirectTo: 'dashboard',
    redirectTo: "pages/login",
    pathMatch: "full",
  },
  {
    path: "error",
    redirectTo: "pages/401",
    pathMatch: "full",
  },
  {
    path: "timeout",
    redirectTo: "pages/599",
    pathMatch: "full",
  },
  {
    path: "",
    component: FullLayoutComponent,
    // data: {
    //   title: "Home"
    // },
    children: [
      // {
      //   path: "dashboard",
      //   loadChildren: "./views/dashboard/dashboard.module#DashboardModule"
      // },
      // {
      //   path: "studio",
      //   loadChildren: "./views/studio/studio.module#StudioManagementModule"
      // },
      {
        path: "usermanagement",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['admin', 'user']
          }
        },
        loadChildren: "./views/usermanagement/usermanagement.module#UserManagementModule"
      },
      {
        path: "campaignmanager",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['admin', 'user'],
            except: ['moderator']
          }
        },
        loadChildren: "./views/campaignmanager/campaignmanager.module#CampaignManagerModule"
      },
      {
        path: "reports",
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['admin', 'moderator','user']
          }
        },
        loadChildren: "./views/reports/reports.module#ReportsManagerModule" 
      }     
    ]
  },
  {
    path: "pages",
    component: SimpleLayoutComponent,
    data: {
      title: "Pages"
    },
    children: [
      {
        path: "",
        loadChildren: "./views/pages/pages.module#PagesModule",
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
