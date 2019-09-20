
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Token, ServiceW, IDateInfo, } from '../_model/displaymodel';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayService } from '../_service/displatservice';
import { AppConfig } from '../../_helpers/app.config';
import * as _ from 'lodash';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TokenalertComponent } from '../tokenalert/tokenalert.component';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { LoadApiUrls } from '../../_helpers/api.urls';

@Component({
  selector: 'app-waitingarea-sync',
  templateUrl: './waitingarea-sync.component.html',
  styleUrls: ['./waitingarea-sync.component.scss']
})
export class WaitingareaSyncComponent implements OnInit, OnDestroy {
  tokenThemes: any;
  currentDateTime: number;
  socketConnect: boolean = false;
  chunkdataflag: boolean = true;
  @Input()
  WaitingList: ServiceW[] = [];
  myTimeout;
  mysocketConnect;
  subscription: any;
  subscriptionLang: any;
  slidevalue: number = 2;
  tokenPopInterval: number = 5;
  displayid: string;
  alertloading: boolean = false;
  tokendata: Token;
  WaitingListParts: any[] = [];
  WaitingListFinal: ServiceW[] = [];
  WaitingListindex = 0;
  arbicFlag: boolean = false;
  displayLang: number = 0;
  displayLanglength: number = 0;
  alertData: Token[] = [];
  private ws: any;
  private stompClient;
  audio = new Audio();

  constructor(private apiUrls: LoadApiUrls, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private displayService: DisplayService, private appConfig: AppConfig) {

    this.audio.src = "assets/audio/" + this.appConfig.getaudiofile();
    console.log("getaudiofile=>", "assets/audio/" + this.appConfig.getaudiofile());
    this.audio.load();
    this.tokenThemes = this.appConfig.gettokenThemes();
    this.displayLanglength = Object.keys(this.tokenThemes).length;
    console.log("tokenThemes=>tokenThemes=>", this.tokenThemes, this.displayLanglength);
    this.displayLang = this.appConfig.getdisplayLang() != null ? this.appConfig.getdisplayLang() : 0;

    let dval1 = this.appConfig.gettokenPopInterval();
    this.tokenPopInterval = dval1 != null ? (dval1 < 5 ? 5 : dval1) : 5;
    this.route.queryParams.subscribe(params => {
      this.displayid = params['displayid'];
      console.log("id=>", this.displayid);
    });
  }
  initializeWebSocketConnection(id) {
    console.log("id=>1", id);
    let _apiurlsdetials = this.apiUrls.getApiServiceUrlByComponentAndMethod("Waitingdisplay", "getWaitingDisplayfromSocket")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      console.log("URL Get from config : ---->  ", _apiurlsdetials.url);

      let dis = this;
      this.ws = new SockJS(_apiurlsdetials.url);
      this.stompClient = Stomp.over(this.ws);
      let socketStartsub = false;
      this.stompClient.connect({ "name": "waitingDisplay", "display_id": this.displayid }, function (frame) {
        console.log('message.body=>', frame, socketStartsub);
        dis.stompClient.subscribe(id, (message) => {
          dis.socketConnect = true;
          console.log('message.body=>', message, dis.socketConnect, socketStartsub, dis.subscription);
          if (!socketStartsub)
            socketStartsub = true;
          else {
            if (!dis.subscription) {
              dis.slideActionStart(false)
            }
            else
              dis.WaitingListindex = 0;
          }


          let response = JSON.parse(message.body);
          console.log("response", response);
          let colori = 1;
          if (response.status) {
            if (response.boardType == 'W') {

              response.waitingDisplay.services.forEach(z => {
                if (colori < dis.displayLanglength) {
                  z.serviceColor = colori + "";
                }
                else {
                  colori = 1;
                  z.serviceColor = colori + "";

                }
                colori++;
              });
              console.log('inside getDisplayData', response.waitingDisplay.services, dis.WaitingList);
              
              if (dis.chunkdataflag) {
                if (!_.isEqual(response.waitingDisplay.services, dis.WaitingList)) {
                  dis.getDisplayData(response.waitingDisplay.services);
                }
               
              }
              else {
                dis.WaitingList = response.waitingDisplay.services;
                dis.WaitingListParts = _.chunk(dis.WaitingList, 4);
                dis.chunkdataflag = true;
              }

            }
            else {
              dis.WaitingList = [];
              if (dis.subscription)
                dis.subscription.unsubscribe();
            }
          }
          else {
            dis.WaitingList = [];
          }

        });
      }, () => {
        console.log('connection failed.');

        setTimeout(() => {
          this.initializeWebSocketConnection(id);
        }, 5000);
      });
    }
    else {
      console.log("URL Get from config : ---->  ", "Url not found..");
    }

  }

  getDisplayData(response: ServiceW[]) {
    console.log('inside getDisplayData', response);

    this.dialog.closeAll();
    let diffData1 = [];

    console.log("waitingDisplay=>", response, this.WaitingList);
    response.forEach(z => {

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
            serviceColor: z.serviceColor,
            status: y.status,
            token: y.token,
            ticketId: y.ticketId,
          } as Token

          this.alertData.push(tokendata);
        });
      }
      else {
        console.log("waitingDisplay=>3", rdata);
        rdata.filter(x => x.roomNumber != null && x.roomNumber != '' && x.status == 'serving').forEach(t => {
          let tokendata = {
            roomNumber: t.roomNumber,
            engRoomName: t.engRoomName,
            arbRoomName: t.arbRoomName,
            serviceColor: z.serviceColor,
            status: t.status,
            token: t.token,
            ticketId: t.ticketId,
          } as Token
          this.alertData.push(tokendata);
        });
        console.log("waitingDisplay=>3", rdata, this.alertData);
      }
    });
    console.log("waitingDisplay=>4", this.alertData);
    this.WaitingList = response;

    this.WaitingListParts = _.chunk(this.WaitingList, 4);
    console.log("WaitingListParts=>", this.WaitingListParts, this.subscription);

    if (this.alertData.length > 0 && !this.alertloading) {
      this.alertloading = true;
      this.repeatAlert(this.alertData);
    }
  }

  ngOnInit() {
    let dval1 = this.appConfig.getReceptionInterval();
    this.slidevalue = dval1 != null ? (dval1 < 2 ? 2 : dval1) : 2;
    this.myTimeout = Observable.interval(1000).subscribe(data => {
      this.currentDateTime = this.currentDateTime + 1000;
    });
    this.displayService.getCurrentDate().subscribe((response: IDateInfo) => {
      if (response) {
        this.currentDateTime = new Date(response.dateTime).getTime();
        console.log(" this.currentDateTime,date.now => ", this.currentDateTime, Date.now());
      }
    });
    this.mysocketConnect = Observable.interval(30000).subscribe(data => {

      if (this.stompClient.connected) {
        console.log("123=>", this.stompClient.connected, this.socketConnect);
        if (this.socketConnect)
          this.socketConnect = false;
        else {
          this.stompClient.connected = false;
          this.chunkdataflag = false;
          this.stompClient.connectCallback();
        }
      }

    });

    if (this.displayid && this.displayid != '') {

      console.log('TotalData=>', this.WaitingList);
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
      if (this.WaitingListParts.length > 0)
        this.WaitingListFinal = this.WaitingListParts[0];
      this.slideActionStart(true);
      // this.initializeWebSocketConnection("/chat/" + this.displayid);

    }
    else {
      this.router.navigate(['**']);
    }
  }
  slideActionStart(action: boolean) {
    console.log("slideActionStart");
    if (action) {
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
      this.initializeWebSocketConnection("/chat/" + this.displayid);
    }
    else {
      if (this.WaitingListParts.length > 0) {
        if (this.WaitingListParts.length <= this.WaitingListindex) {
          this.WaitingListindex = 0;
          this.WaitingListFinal = this.WaitingListParts[0];
        }
        else {
          this.WaitingListFinal = this.WaitingListParts[this.WaitingListindex];
          this.WaitingListindex++;
        }
      }
      else
        this.WaitingListFinal = [];
      this.subscription = Observable.interval(this.slidevalue * 1000).subscribe(data => {
        if (this.WaitingListParts.length > 0) {
          if (this.WaitingListParts.length <= this.WaitingListindex) {
            this.WaitingListindex = 0;
            this.WaitingListFinal = this.WaitingListParts[0];
          }
          else {
            this.WaitingListFinal = this.WaitingListParts[this.WaitingListindex];
            this.WaitingListindex++;
          }
        }
        else
          this.WaitingListFinal = [];
      });
    }
  }

  repeatAlert(dataT: Token[]) {
    console.log("dataT=>", dataT.length, this.alertloading);

    this.dialog.closeAll();
    if (dataT.length > 0 && this.alertloading) {
      let dataalert = dataT[0];
      dataT.splice(0, 1);
      if (dataalert.roomNumber != null && dataalert.roomNumber != '') {
        const dialogRef = this.dialog.open(TokenalertComponent, this.getDialogConfig({ data: dataalert, colourdata: (this.tokenThemes[dataalert.serviceColor] == null ? this.tokenThemes['0'] : this.tokenThemes[dataalert.serviceColor]), langData: this.displayLang }));
        this.playAudio();
        // dialogRef.beforeClose().subscribe(s=>{
        //   this.audio.currentTime = 0;
        //   this.audio.pause();
        // });

        setTimeout(() => this.repeatAlert(dataT), this.tokenPopInterval * 1000);

      }
      else if (this.alertloading)
        this.repeatAlert(dataT)
    }
    else {
      this.alertloading = false;
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
    this.audio.pause();
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.mysocketConnect)
      this.mysocketConnect.unsubscribe();
    if (this.subscriptionLang)
      this.subscriptionLang.unsubscribe();

    if (this.stompClient != null) {
      this.stompClient.close();
    }
    if (this.ws != null) {
      this.ws.close();
    }
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
