import { ActionType, AlertMessageService, AlertType } from "../../../_services/AlertMessageService";
import { ApiResponse, CustomersData, SegementCustomerData, creteProfileOpenData } from "../_model/segement-manage.model";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";

import { AddsegmentComponent } from "../segment/segmentCreate/addsegment.component";
import { ConfirmSegmentComponent } from "../segment-manageConfirm.component";
import { CreateCustomerComponent } from "../customer-profile/createCustomer/createprofile.component";
import { CustomerdetailsComponent } from "../customer-profile/details/customerdetails.component";
import { SegmentDetailsComponent } from "../segment/details/segment-details.component";
import { SegmentManageService } from "../_service/segment-manage.service";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";

declare var $: any;
@Component({
  selector: 'app-segment-management',
  templateUrl: './segment-management.component.html',
  styleUrls: ['./segment-management.component.scss']
})
export class SegmentManagementComponent implements OnInit {
  segmentsList: SegementCustomerData[] = [];
  filteredSegmentList: SegementCustomerData[] = [];
  selectedSegCusData: SegementCustomerData;
  customersList: CustomersData[] ;
  customerListflag: boolean = true;
  initPage = 0;
  customPage = 0;
  segmentId = 0;
  searchdata: string;
  pageSize = environment.pageSize;
  loading: boolean = false;
  editStatus: number;
  filteredCutomerList: CustomersData[] = [];
  constructor(private manageService: SegmentManageService, private translate: TranslateService, private alertMessage: AlertMessageService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getSegments();

  }

  getSegments() {
    this.customerListflag = true;
    this.searchdata = '';
    this.loading = true;
    this.manageService.getSegmentwithCustomers().subscribe((result: SegementCustomerData[]) => {
      this.segmentsList = result;
      console.log("segmentsList:::::", this.segmentsList);
      this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      this.loading = false;
      // this.assignCustomers();
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSegments==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }


  getCustomerData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filteredCutomerList = this.customersList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.customPage = _pageData.pageIndex;
    console.log("Department data::" + JSON.stringify(this.customersList));
  }



  getData(_pageData) {
    let index = 0;
    const startingIndex = _pageData.pageIndex * _pageData.pageSize;
    const endingIndex = startingIndex + _pageData.pageSize;
    this.filteredSegmentList = this.segmentsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    this.customPage=0;
    this.customersList = this.filteredSegmentList.length > 0 ? this.filteredSegmentList[0].customersData : [];
    if (this.filteredSegmentList.length > 0) {
      if (this.segmentId > 0) {
        let indx = this.filteredSegmentList.findIndex(x => x.segmentId == this.segmentId);
        if (indx != -1) {
          this.customersList = this.filteredSegmentList[indx].customersData;
          this.assignCustomers(this.filteredSegmentList[indx]);
          console.log("customersList::::", this.customersList);
        }
        else {
          this.customersList = this.filteredSegmentList[0].customersData;
          this.assignCustomers(this.filteredSegmentList[0]);

        }
      }
      else {
        this.assignCustomers(this.filteredSegmentList[0]);
      }
    }
    else
      this.customersList = [];

  }
  addSegment() {
    console.log("Create Department:");
    const dialogRef = this.dialog.open(AddsegmentComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSegments();
      }
    });
  }

  editSegment(segDetails: SegementCustomerData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = segDetails;
    const dialogRef = this.dialog.open(AddsegmentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSegments();
      }
    });
  }

  editCustomer(customer: CustomersData) {
    let creteProfileOpenData = {
      type: 2,
      CustomersDataData: customer,
      segmentId: this.segmentId
    } as creteProfileOpenData;
    const dialogRef = this.dialog.open(CreateCustomerComponent, this.getDialogConfig(creteProfileOpenData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSegments();
      }
    });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  assignCustomers(segments?: SegementCustomerData) {
    this.customPage=0;
    this.customerListflag = true;
    console.log("segments", segments);
    if (segments == undefined) {
      segments = this.segmentsList[0];
    }
    if (segments) {
      this.segmentId = segments.segmentId;
      console.log('levelDetails=>', segments);
      this.customersList = segments.customersData;
      this.getCustomerData({ pageIndex: this.customPage, pageSize: this.pageSize });
      console.log('deptList=>', this.customersList);
      this.editStatus = segments.status;
    } else {
      console.log("segments not found");
    }
  }

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  deleteSegment(selectedSegment) {
    console.log("deleteSegment :");
    const dialogRef = this.dialog.open(ConfirmSegmentComponent, {
      width: '500px',
      data: this.translate.instant('CustomermanagementModule.segmentManagement.manage.confirmMessage3') + '\"' + selectedSegment.segmentName + '\" ...?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        selectedSegment.status = status;
        this.manageService.deleteSegment(selectedSegment.segmentId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSegments();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteSegment==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }

  getCustomerDetails(customerDetails: CustomersData) {
    this.dialog.open(CustomerdetailsComponent, this.getDialogConfig(customerDetails));
  }

  applyFilterStatus(segm: SegementCustomerData, status: number) {
    let data: any = status ? this.translate.instant('CustomermanagementModule.segmentManagement.manage.confirmMessage') + '\"' + segm.segmentName + '\" ...?' : this.translate.instant('CustomermanagementModule.segmentManagement.manage.confirmMessage1') + '\"' + segm.segmentName + '\" ...?';
    // let data: any = status ? "Do you want to Activate segment" : "Do you want to DeActivate segment";
    const dialogRef = this.dialog.open(ConfirmSegmentComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        segm.status = status;
        this.manageService.updateSegmentStatus(segm.segmentId, status)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getSegments();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-applyFilterStatus==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }

    });
  }

  segmentDetails(segmentdetails) {
    this.dialog.open(SegmentDetailsComponent, this.getDialogConfig(segmentdetails));
  }

  activeClass(event) {
    $('#sndrActv').find('mat-card').removeClass('pbActive');
    event.currentTarget.classList.add("pbActive");
  }

  addCustomer() {
    let creteProfileOpenData = {
      type: 3
    } as creteProfileOpenData;
    const dialogRef = this.dialog.open(CreateCustomerComponent, this.getDialogConfig(creteProfileOpenData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSegments();
      }
    });
  }
  addCustomerunderSement(segment: SegementCustomerData) {
    let creteProfileOpenData = {
      type: 1,
      SegementCustomerData: segment
    } as creteProfileOpenData;
    console.log("segmentId::::", segment);

    const dialogRef = this.dialog.open(CreateCustomerComponent, this.getDialogConfig(creteProfileOpenData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSegments();
      }
    });
  }

  searchFilter(event) {
    if (event != null && event != '') {
      this.customersList = [];
      this.customerListflag = false;
    }
    else {
      let index = this.filteredSegmentList.findIndex(x => x.segmentId == this.segmentId);
      if (index != -1) {
        this.customersList = this.filteredSegmentList[index].customersData;
      }
      else{
        this.customersList =[];
      }
      this.customerListflag = true;
    }
  }
}
