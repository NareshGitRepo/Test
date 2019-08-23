import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { QuickComponent } from "./quick.component";
import { BulkComponent } from "./bulk.component";
import { CampaignStatusComponent } from "./campaignstatus.component";
import { CampaignDetailsComponent } from "./campaigndetails.component";


const routes: Routes = [
  {
    path: "",
    data: {
      title: "Campaign"
    },
    children: [
      {
        path: "quick",
        component: QuickComponent,
        data: {
          title: "Quick"
        }
      },
      {
        path: "bulk",
        component: BulkComponent,
        data: {
          title: "Bulk"
        }
      },
      {
        path: "campaignstatus",
        component: CampaignStatusComponent,
        data: {
          title: "Status"
        }
      },
      {
        path: "campaigndetails",
        component: CampaignDetailsComponent,
        data: {
          title: "Details"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule {}
