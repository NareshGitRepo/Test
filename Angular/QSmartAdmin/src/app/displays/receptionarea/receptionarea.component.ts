import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {  ReceptionDisplay, IDisplayBoard, DepartmentR } from '../_model/displaymodel';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AppConfig } from '../../_helpers/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from '../_service/displatservice';

@Component({
  selector: 'app-receptionarea',
  templateUrl: './receptionarea.component.html',
  styleUrls: ['./receptionarea.component.scss']
})
export class ReceptionareaComponent implements OnInit, OnDestroy {
  currentDateTime: number;
  @Input()
  TotelData: ReceptionDisplay;
  ReceptionList: DepartmentR[];
  ReceptionListParts: any[] = [];
  ReceptionListFinal: DepartmentR[] = [];
  myTimeout;
  subscription;
  subscriptiond;
  displayid: string;
  refreshAction: boolean = true;
  intervalValue: number = 60;
  intval: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private displayService: DisplayService, private appConfig: AppConfig) {
    let dval = this.appConfig.getDisplayInterval();       console.log('dval',dval)
    this.intervalValue = dval != null ? (dval < 5 ? 5 : dval) : 60;       console.log('this.intervalValue',this.intervalValue)
    this.route.queryParams.subscribe(params => {
      this.displayid = params['displayid'];
      console.log("id=>", this.displayid);
    });

  }

  ngOnInit() {

    console.log("Reception List:::::", this.ReceptionList);
    this.myTimeout = Observable.interval(1).subscribe(data => {       console.log('data - 43 ::',data)
      this.currentDateTime = Date.now();
    });
    
    if (this.displayid && this.displayid != '') {
      let dval = this.appConfig.getReceptionInterval();
    this.ReceptionList = this.TotelData.departments;
    console.log('reception=>' + JSON.stringify(this.ReceptionList));
    this.ReceptionListParts = _.chunk(this.ReceptionList, 4);     //Creates an array of elements split into groups the length of size.
    console.log('this.ReceptionListParts',this.ReceptionListParts);
    if (this.ReceptionListParts.length > 1) {
      let i = 1;
      if (this.subscription) {
        i = 0;
      }
      else {
        this.ReceptionListFinal = this.ReceptionListParts[0];
        this.subscription = Observable.interval(dval * 1000).subscribe(data => {
          console.log('data - 61 ::',data)
          if (this.ReceptionListParts.length == i) {
            i = 0;
          }
          this.ReceptionListFinal = this.ReceptionListParts[i];
          i++;
        });
      }
    }
    else if (this.ReceptionListParts.length == 1) {
      this.ReceptionListFinal = this.ReceptionListParts[0];
    }
    else {
      this.ReceptionListFinal = [];
    }
      this.subscriptiond = Observable.interval(this.intervalValue * 1000).subscribe(data => {
        if (this.refreshAction)
          this.getDisplayData();
      });
    }
    else {
      this.router.navigate(['**']);
    }
  }
  getDisplayData() {

    this.refreshAction = false;
    this.intval = (this.intervalValue / 2);              console.log('this.intval ::',this.intval)
    this.displayService.getDisplayInfo(this.displayid).timeout(this.intval * 1000).subscribe((resposne: IDisplayBoard) => {
      console.log('resposne', resposne,'resposne.status', resposne.status);
      if (resposne.status) {
        if (resposne.boardType == 'R') {
          this.TotelData = resposne.receptionDisplay;
          console.log("ReceptionList", this.ReceptionList);
          let dval = this.appConfig.getReceptionInterval();
          this.ReceptionList = this.TotelData.departments;
          this.ReceptionListParts = _.chunk(this.ReceptionList, 4);
          if (this.ReceptionListParts.length > 1) {
            let i = 1;
            if (this.subscription) {
              i = 0;
            }
            else {
              this.ReceptionListFinal = this.ReceptionListParts[0];


              this.subscription = Observable.interval(dval * 1000).subscribe(data => {

                if (this.ReceptionListParts.length == i) {
                  i = 0;
                }
                this.ReceptionListFinal = this.ReceptionListParts[i];
                i++;
              });
            }
          }
          else if (this.ReceptionListParts.length == 1) {
            this.ReceptionListFinal = this.ReceptionListParts[0];
          }
          else {
            this.ReceptionListFinal = [];
            if (this.subscription)
              this.subscription.unsubscribe();
          }
        }
        else {
          let rdata: ReceptionDisplay;
          this.TotelData = rdata;
          this.ReceptionListFinal = [];
          if (this.subscription)
            this.subscription.unsubscribe();
        }
      }
      this.refreshAction = true;
    }, error => {
      console.log("Failed :: ", JSON.stringify(error));
      if (error.status == 0) {
        let rdata: ReceptionDisplay;
        this.TotelData = rdata;
        this.ReceptionListFinal = [];
        if (this.subscription)
          this.subscription.unsubscribe();
      }
      this.refreshAction = true;
    });
  }
  ngOnDestroy() {
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptiond)
      this.subscriptiond.unsubscribe();
  }
}
