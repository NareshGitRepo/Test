import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from "../../../../node_modules/ngx-uploader";
// services
import { Page } from "../../beans/page";
import { OpFileHistoryInfo } from "../../beans/filehistory";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CallTrackingService } from "../../services/reports/calltracking.service";
import { CallTrackingReport } from "../../beans/reports/calltracking";

@Component({
  templateUrl: "calltracking.component.html"
})
export class CallTrackingComponent implements OnInit {

  page = new Page();
  rows = new Array<CallTrackingReport>();
  temp = [];
  public resultSetObj: CallTrackingReport[];
  loadingIndicator = true;
  public loading = false;

  constructor(private service: CallTrackingService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    console.log("CallTrackingComponent:ngOnInit:");
    this.getData();
  }

  getData() {
    console.log("CallTrackingComponent:getData:");
    this.resultSetObj = [];
    // this.loading = true;
    this.service.getCallTrackingReport().subscribe(data => {
      this.loading = false;
      this.loadingIndicator = false;
      this.resultSetObj = data;
      console.log("Queues Length : ", this.resultSetObj.length);
      this.temp = [...this.resultSetObj];
      this.setPage({ offset: 0 });
    });
  }

  setPage(pageInfo) {
    console.log("CallTrackingComponent:setPage:");
    this.page.pageNumber = pageInfo.offset;
    this.service.getCallTrackingResults(this.page, this.resultSetObj).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      // console.log("Rows : ", this.rows);
    });
  }

  updateFilter(event) {
    console.log("CallTrackingComponent:updateFilter:");
    const val = event.target.value.toLowerCase();
    console.log("Filter Input obj ==> : ", val);
    const temp = this.temp.filter(function (d) {
      console.log("User Id : --> ", d.filepath);
      return d.filepath.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.page.pageNumber = 0;
  }

}