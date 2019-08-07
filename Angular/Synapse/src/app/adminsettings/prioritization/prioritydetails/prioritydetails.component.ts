import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { PrioritizationService } from '../_services/prioritizationService';
import { IMsgPriorityInfo, ServiceList } from '../_model/prioritizationmodel';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prioritydetails',
  templateUrl: './prioritydetails.component.html',
  styleUrls: ['./prioritydetails.component.scss']
})
export class PrioritydetailsComponent implements OnInit {
  Prioritydetails:any;
  // dataSource = new MatTableDataSource();
  // displayedColumns: string[] = ["priorityName","categoryDesc"];

  servicelist:ServiceList[]=[];
  constructor(private dialogRef: MatDialogRef<PrioritydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data:IMsgPriorityInfo,private _service:PrioritizationService,private translate: TranslateService,
    private alertMessage: AlertMessageService, private router: Router) { }
    ngOnInit() {
      console.log("data:::",this.data);
      
      this.getServices();
      if(this.data != null){
        this.Prioritydetails = this.data;
      }
    }
    getServices(){
      this._service.getServicesByPriorityId(this.data.priorityId).subscribe((response: ServiceList[])=>{
        console.log("responce::::",response);
        
        
        if (response != undefined) {
          this.servicelist = response;
        }
     
      },
        error => {
          let message = error.error.messages as string;
          let errorMessage =
            error.status == 404
              ? this.translate.instant("ActionNames.errorResponse")
              : message
                ? message
                : error.message;
          console.error("E-getServices==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          // this.loading = false;
        });
    }
    showAlert(error: any, action: ActionType, status: number = 0) {
      if (status == 401)
        this.router.navigate(['401']);
      else setTimeout(() => this.alertMessage.showAlert(error, action));
    }

}
