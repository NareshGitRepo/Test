import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IDisplayBoard, Token, ServiceW, WaitingDisplay, } from '../_model/displaymodel';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from '../_service/displatservice';
import { AppConfig } from '../../_helpers/app.config';
import * as _ from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TokenalertComponent } from '../tokenalert/tokenalert.component';

@Component({
  selector: 'app-waitingarea',
  templateUrl: './waitingarea.component.html',
  styleUrls: ['./waitingarea.component.scss']
})
export class WaitingareaComponent implements OnInit, OnDestroy {
  // ColourStr:string='tknDefault';
  tokenThemes: any;
  currentDateTime: number;
  DateTimeFormat: string;
  @Input()
  WaitingList: ServiceW[];
  myTimeout;
  subscription: any;
  subscriptionRefresh: any;
  subscriptionLang: any;
  intervalValue: number = 60;
  slidevalue: number = 2;
  tokenPopInterval: number = 5;
  intval: number = 0;
  refreshAction: boolean = true;
  displayid: string;
  alertloading: boolean = false;
  reloading: boolean = false;
  tokendata: Token;
  WaitingListParts: any[] = [];
  WaitingListFinal: ServiceW[] = [];
  TotelData: WaitingDisplay;
  arbicFlag: boolean = false;
  displayLang: number = 0;
  displayLanglength: number = 0;
  audio = new Audio();
  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private displayService: DisplayService, private appConfig: AppConfig) {
    this.audio.src = "assets/audio/" + this.appConfig.getaudiofile();
    console.log("getaudiofile=>", "assets/audio/" + this.appConfig.getaudiofile());
    this.audio.load();
    this.tokenThemes = this.appConfig.gettokenThemes();
    this.displayLanglength = Object.keys(this.tokenThemes).length;
    console.log("tokenThemes=>", this.tokenThemes, this.displayLanglength);
    this.displayLang = this.appConfig.getdisplayLang() != null ? this.appConfig.getdisplayLang() : 0;
    let dval = this.appConfig.getDisplayInterval();
    this.intervalValue = dval != null ? (dval < 5 ? 5 : dval) : 60;
    let dval1 = this.appConfig.getReceptionInterval();
    this.slidevalue = dval1 != null ? (dval1 < 2 ? 2 : dval1) : 2;
    dval1 = this.appConfig.gettokenPopInterval();
    this.tokenPopInterval = dval1 != null ? (dval1 < 5 ? 5 : dval1) : 5;
    this.route.queryParams.subscribe(params => {
      this.displayid = params['displayid'];
      console.log("id=>", this.displayid);
    });

  }
  getDisplayData() {
    //this.playAudio();

    this.refreshAction = false;
    this.intval = (this.intervalValue / 2);
    this.displayService.getDisplayInfo(this.displayid).timeout(this.intval * 1000).subscribe((resposne: IDisplayBoard) => {

      console.log(resposne, resposne.status);
      if (resposne.status) {
        if (resposne.boardType == 'W') {


          this.dialog.closeAll();
          let diffData = [];
          let diffData1 = [];
          let colori = 1;
          console.log("waitingDisplay=>", resposne.waitingDisplay.services);
          resposne.waitingDisplay.services.forEach(z => {
            if (colori < this.displayLanglength) {
              z.serviceColor = colori + "";
            }
            else {
              colori = 1;
              z.serviceColor = colori + "";

            }
            let rdata = z.tokens;
            let wwdata = this.WaitingList.filter(s => s.serviceEngName == z.serviceEngName);
            console.log("waitingDisplay=>1", wwdata);
            if (wwdata.length > 0) {
              diffData1 = _.differenceWith(rdata, wwdata[0].tokens, _.isEqual);
              console.log("waitingDisplay=>2", rdata, wwdata, diffData1);
              diffData1.filter(x => x.roomNumber != null && x.roomNumber != '' && x.status == 'serving').forEach(y => {
                let tokendata = {
                  roomNumber: y.roomNumber,
                  engRoomName: y.engRoomName,
                  arbRoomName: y.arbRoomName,
                  serviceColor: colori + '',
                  status: y.status,
                  token: y.token,
                  ticketId: y.ticketId,
                } as Token

                diffData.push(tokendata);
              });
            }
            else {
              console.log("waitingDisplay=>3", rdata);
              rdata.filter(x => x.roomNumber != null && x.roomNumber != '' && x.status == 'serving').forEach(t => {
                let tokendata = {
                  roomNumber: t.roomNumber,
                  engRoomName: t.engRoomName,
                  arbRoomName: t.arbRoomName,
                  serviceColor: colori + '',
                  status: t.status,
                  token: t.token,
                  ticketId: t.ticketId,
                } as Token
                diffData.push(tokendata);
              });
              console.log("waitingDisplay=>3", rdata, diffData);
            }
            colori++;
          });
          console.log("waitingDisplay=>4", diffData);
          this.WaitingList = resposne.waitingDisplay.services;


          // this.TotelData = resposne.waitingDisplay;
          // this.WaitingList = this.TotelData.services;
          this.WaitingListParts = _.chunk(this.WaitingList, 4);
          console.log("WaitingListParts=>", this.WaitingListParts, this.subscription);

          if (this.WaitingListParts.length > 1) {
            let i = 1;
            if (this.subscription && !this.subscription.isStopped) {
              i = 0;
              console.log("WaitingListParts=>", this.subscription);
            }
            else {
              // this.subscription.subscribe();
              this.WaitingListFinal = this.WaitingListParts[0];
              this.subscription = Observable.interval(this.slidevalue * 1000).subscribe(data => {

                if (this.WaitingListParts.length == i) {
                  i = 0;
                }
                this.WaitingListFinal = this.WaitingListParts[i];
                i++;
              });
            }
          }
          else if (this.WaitingListParts.length == 1) {
            if (this.subscription)
              this.subscription.unsubscribe();
            this.WaitingListFinal = this.WaitingListParts[0];
          }
          else {
            this.WaitingListFinal = [];
            if (this.subscription)
              this.subscription.unsubscribe();
          }
          if (diffData.length > 0) {
            this.alertloading = true;
            this.repeatAlert(diffData, 0);
          }

        }
        else {
          let rdata: WaitingDisplay;
          this.TotelData = rdata;
          this.WaitingListFinal = [];
          this.WaitingList = [];
          if (this.subscription)
            this.subscription.unsubscribe();
        }
      }
      else {
        this.WaitingList = [];
      }
      this.refreshAction = true;
    }, error => {
      console.log("Failed :: ", JSON.stringify(error));
      // if (error.status == 0) {
      //   this.WaitingList = [];
      // }
      this.refreshAction = true;
    });
  }

  ngOnInit() {
    this.myTimeout = Observable.interval(1).subscribe(data => {
      this.currentDateTime = Date.now();
    });
    if (this.displayid && this.displayid != '') {

      console.log('TotelData=>', this.WaitingList);
      // this.WaitingList = this.TotelData.services;
      console.log('reception=>' + JSON.stringify(this.WaitingList));
      let colori = 1;
      this.WaitingList.forEach(x => {
        if (colori < this.displayLanglength) {
          x.serviceColor = colori + "";
          colori++;
        }
        else {
          colori = 1;
          x.serviceColor = colori + "";
          colori++;
        }
      });
      this.WaitingListParts = _.chunk(this.WaitingList, 4);
      console.log('WaitingListParts=>23', this.WaitingListParts)
      if (this.WaitingListParts.length > 1) {
        let i = 1;
        if (this.subscription) {
          i = 0;
        }
        else {
          this.WaitingListFinal = this.WaitingListParts[0];
          this.subscription = Observable.interval(this.slidevalue * 1000).subscribe(data => {

            if (this.WaitingListParts.length == i) {
              i = 0;
            }
            this.WaitingListFinal = this.WaitingListParts[i];
            i++;
          });
        }
      }
      else if (this.WaitingListParts.length == 1) {
        this.WaitingListFinal = this.WaitingListParts[0];
      }
      else {
        this.WaitingListFinal = [];
      }
      this.reloadmethod();

      if (this.displayLang == 0)
        this.arbicFlag = false;
      else if (this.displayLang == 1)
        this.arbicFlag = true;
      else if (this.displayLang == 2) {
        this.subscriptionLang = Observable.interval(Math.floor(this.slidevalue / 2) * 1000).subscribe(data => {
          this.arbicFlag = !this.arbicFlag;
        });
      }
      else
        this.arbicFlag = false;
    }
    else {
      this.router.navigate(['**']);
    }
  }
  reloadmethod() {
    this.reloading = false;
    if (this.subscriptionRefresh) {
      this.subscriptionRefresh.unsubscribe();
      if (this.refreshAction) {
        if (!this.alertloading)
          this.getDisplayData();

      }
    }
    this.subscriptionRefresh = Observable.interval(this.intervalValue * 1000).subscribe(data => {
      if (this.refreshAction) {
        if (!this.alertloading)
          this.getDisplayData();
        else {
          this.reloading = true;
        }
      }
    });
  }
  repeatAlert(dataT: any, i: number) {
    console.log("dataT=>", dataT.length, i, dataT.length > i, this.alertloading);

    this.dialog.closeAll();
    if (dataT.length > i && this.alertloading) {
      if (dataT[i].roomNumber != null && dataT[i].roomNumber != '') {
        //this.tokendata = diffData[0]
        const dialogRef = this.dialog.open(TokenalertComponent, this.getDialogConfig({ data: dataT[i], colourdata: (this.tokenThemes[dataT[i].serviceColor] == null ? this.tokenThemes['0'] : this.tokenThemes[dataT[i].serviceColor]), langData: this.displayLang }));
        this.playAudio();
        setTimeout(() => this.repeatAlert(dataT, i + 1), this.tokenPopInterval * 1000);

      }
      else if (this.alertloading)
        this.repeatAlert(dataT, i + 1)
    }
    else {
      this.alertloading = false;
      if (this.reloading) {
        this.reloadmethod();
      }
    }
  }

  playAudio() {
    try {
      this.audio.currentTime = 0;
      this.audio.pause();
      //this.audio.play();
      const playPromise = this.audio.play();
      // console.error("playPromise=>",playPromise);
      if (playPromise !== null && playPromise) {
        playPromise.catch(() => { this.audio.play(); })
      }
    }
    catch (e) {
      console.error('error=>', e);
    }

  }
  ngOnDestroy() {
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionRefresh)
      this.subscriptionRefresh.unsubscribe();
    if (this.subscriptionLang)
      this.subscriptionLang.unsubscribe();
  }
  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60vw';
    dialogConfig.height = '70%';
    dialogConfig.panelClass = 'newtknalert';
    //dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  click() {
    // const dialogRef = this.dialog.open(TokenalertComponent, this.getDialogConfig({data:{token:"TF12",roomNumber:"T102"},colourdata:"tknDefault"}));
  }
}
