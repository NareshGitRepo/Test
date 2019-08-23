import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from "../../../../node_modules/ngx-uploader";
// services
import { Page } from "../../beans/page";
import { OpFileHistoryInfo } from "../../beans/filehistory";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import * as moment from "moment-timezone";
import { DatePipe } from "@angular/common";
import { Http } from "@angular/http";
import { DetailedService } from "../../services/reports/detailed.service";
import { CdrReport } from "../../beans/reports/cdr";
import { CdrDetailService } from "../../services/reports/cdrdetail.service";

@Component({
  templateUrl: "cdrdetail.component.html"
})
export class CdrDetailComponent implements OnInit {

  page = new Page();
  rows = new Array<CdrReport>();
  temp = [];
  public resultSetObj: CdrReport[];
  loadingIndicator = true;
  public loading = false;
  moment = moment();
  model: any = {};

  constructor(private service: CdrDetailService, private datePipe: DatePipe) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    console.log("CdrDetailComponent:ngOnInit:");
    this.model.DateTime = new Date();
    this.getData();
  }

  getData() {
    console.log("CdrDetailComponent:getData:");
    this.resultSetObj = [];
    // this.loading = true;
    this.service.getCdrDetailReport().subscribe(data => {
      this.loading = false;
      this.loadingIndicator = false;
      this.resultSetObj = data;
      console.log("Queues Length : ", this.resultSetObj.length);
      this.temp = [...this.resultSetObj];
      this.setPage({ offset: 0 });
    });
  }

  setPage(pageInfo) {
    console.log("CdrDetailComponent:setPage:");
    this.page.pageNumber = pageInfo.offset;
    this.service.getDetailedResults(this.page, this.resultSetObj).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      // console.log("Rows : ", this.rows);
    });
  }

  updateFilter(event) {
    console.log("CdrDetailComponent:updateFilter:");
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
