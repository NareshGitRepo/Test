import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SummaryComponent } from "./summary.component";
import { DetailedComponent } from "./detailed.component";
import { CallTrackingComponent } from "./calltracking.component";
import { CdrDetailComponent } from "./cdrdetail.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Reports"
    },
    children: [
      {
        path: "summary",
        component: SummaryComponent,
        data: {
          title: "Summary"
        }
      },
      {
        path: "detailed",
        component: DetailedComponent,
        data: {
          title: "Detailed"
        }
      },
      {
        path: "calltracking",
        component: CallTrackingComponent,
        data: {
          title: "CallTracking"
        }
      },
      {
        path: "cdrdetails",
        component: CdrDetailComponent,
        data: {
          title: "CdrDetails"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
