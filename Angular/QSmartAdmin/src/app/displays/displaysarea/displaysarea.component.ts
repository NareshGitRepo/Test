import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from '../_service/displatservice';
import { IDisplayBoard, ReceptionDisplay, ServiceW, } from '../_model/displaymodel';
import { AppConfig } from '../../_helpers/app.config';

@Component({
  selector: 'app-displaysarea',
  templateUrl: './displaysarea.component.html',
  styleUrls: ['./displaysarea.component.scss']
})
export class DisplaysareaComponent implements OnInit, OnDestroy {

  ReceptionList: ReceptionDisplay;
  WaitingList: ServiceW[];
  _receptionflag: boolean;
  _actionFlag = false;
  _errorFlag = false;
  _errorCode = -1;
  displayid: string;
  //subscription: any;
  intervalValue: number = 60;
  intval: number = 0;
  refreshAction: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private displayService: DisplayService, private appConfig: AppConfig) {
    let dval = this.appConfig.getDisplayInterval();     console.log('dval',dval);
    this.intervalValue = dval != null ? (dval < 30 ? 30 : dval) : 60;       console.log('this.intervalValue',this.intervalValue)
    this.route.queryParams.subscribe(params => {
      this.displayid = params['displayid'];
      console.log("id=>", this.displayid);
    });

  }
  getDisplayData() {
    this._errorFlag = false;
    this._actionFlag = false;
    this.refreshAction = false;
    this.intval = (this.intervalValue / 2);     console.log('this.intval',this.intval);
    this.displayService.getDisplayInfo(this.displayid).timeout(this.intval * 1000).subscribe((resposne: IDisplayBoard) => {
      console.log('response Display Data',resposne, 'response status',resposne.status);
      if (resposne.status) {
        console.log("ReceptionList", resposne);
        this._actionFlag = true;
        if (resposne.boardType == 'R') {
          this.ReceptionList = resposne.receptionDisplay;  console.log('this.ReceptionList',this.ReceptionList);
          this._receptionflag = true;
        } else {
          this.WaitingList = resposne.waitingDisplay.services;      console.log('this.WaitingList ', this.WaitingList );
          this._receptionflag = false;
        }
      }
      else {
        this._actionFlag = false;
        this._errorFlag = true;
        this._errorCode = -1;
      }
      this.refreshAction = true;
    }, error => {
      this._actionFlag = false;
      console.log("Failed :: ", JSON.stringify(error));
      if (error.status == 0) {
        let rdata: ReceptionDisplay;     
        this.ReceptionList = rdata;        console.log('this.ReceptionList',this.ReceptionList);
        this.WaitingList = [];
      }
      this._errorCode = error.status;        console.log('this._errorCode',this._errorCode);
      this._errorFlag = true;
      this.refreshAction = true;
    });
  }
  ngOnInit() {
    if (this.displayid && this.displayid != '') {
      this.getDisplayData();
      // this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {
      //   if(this.refreshAction)
      //   this.getDisplayData();
      // });
    }
    else {
      this.router.navigate(['**']);
    }
  }

  ngOnDestroy() {
    // if (this.subscription)
    //   this.subscription.unsubscribe();
  }
}