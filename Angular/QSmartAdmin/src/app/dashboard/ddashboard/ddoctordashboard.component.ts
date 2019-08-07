import {ActionType,AlertMessageService} from "../../_services/alertMessageService";
import {AppConfig,ITokenInfo,IUserUpdateDto } from "../../_helpers/app.config";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IDashboardInfo, IDoctorApptsAndCheckin, IDoctorWaiting, IUserDashboardInfo } from "./_model/ddashboard.model";

import { BaseChartDirective } from "ng2-charts";
import { DatePipe } from "@angular/common";
import { DdashboardService } from "./_ddashboardservice/ddashboard.service";
import { Observable } from "rxjs";
import { Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-doctordashboard",
  templateUrl: "./ddoctordashboard.component.html",
  styleUrls: ["./ddoctordashboard.component.scss"]
})
export class DDoctordashboardComponent implements OnInit, OnDestroy {
  Info: IDashboardInfo;
  _tokenInfo: IUserUpdateDto;
  _userId: number = 0;
  _userName: string;
  subscription: any;
  intervalValue: number = 60;
  refreshAction: boolean = true;
  loading:boolean=false;

  @ViewChild("baseChart") chart: BaseChartDirective;
  
  constructor(
    private ddashboardservice: DdashboardService,
    private datePipe: DatePipe,
    private appconfig: AppConfig,
    private router: Router,
    private translate: TranslateService,
    private alertMessage: AlertMessageService ) {
    let dval = this.appconfig.getdashboardInterval();
    this.intervalValue = dval != null ? (dval < 5 ? 5 : dval) : 60;
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData) this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._userId = this._tokenInfo.userId;
      this._userName = this._tokenInfo.firstname;
    } else this.router.navigate(["401"]);

    console.log(
      "Arabic=>",
      this.translate.instant("DashBoardModule.doctordashboard.todayappts"),
      this.translate.instant("ActionNames.errorResponse")
    );
  }  //constructor

  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
      position: "top"
    }
  };

  today = this.datePipe.transform(Date.now(), "yyyy-MM-dd");
  barChartLabels: string[] = [
    this.translate.instant("DashBoardModule.doctordashboard.todayappts"),
    this.translate.instant("DashBoardModule.doctordashboard.patientscheckedin"),
    this.translate.instant("DashBoardModule.doctordashboard.patientswaiting"),
    this.translate.instant("DashBoardModule.doctordashboard.patientsserving"),
    this.translate.instant("DashBoardModule.doctordashboard.patientsserved")
  ];
  barChartHorizontalType = "horizontalBar";
  barChartData: any[] = [
    {
      data: [],
      borderWidth: 0
    }
  ];
  barChartHorizontalOptions: any = Object.assign(
    {
      scaleShowVerticalLines: false,

      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0,0,0,0.02)",
              zeroLineColor: "rgba(0,0,0,0.02)"
            },
            ticks: {
              beginAtZero: true
              //suggestedMax: 9
            }
          }
        ],

        yAxes: [
          {
            gridLines: {
              color: "rgba(0,0,0,0.02)",
              zeroLineColor: "rgba(0,0,0,0.02)"
            }
          }
        ]
      }
    },
    this.globalChartOptions
  );
  lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: ["#22bad1", "#f69922", "#71a60f", "#37d8bd", "#be83e9"],
      borderColor: "#3f51b5",
      pointBackgroundColor: "#3f51b5",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];

  ngOnInit() {
    this.getdashboardByDoctId(true);
    this.subscription = Observable.interval(
      this.intervalValue * 1000
    ).subscribe(data => {
      if (this.refreshAction)
       this.getdashboardByDoctId(false);
    });
  }
  getdashboardByDoctId(action:boolean) {
    this.loading=action;
    this.refreshAction = false;
   // let Idata: IDashboardInfo;
    console.log("data=>111", this.Info);
    this.ddashboardservice.getUserWiseDashboard().subscribe((resultuser: IUserDashboardInfo) => {
      console.log("resultuser=>1", resultuser);
      if (resultuser && resultuser != null) {
        this.ddashboardservice.getDashBoardWaitingByDoctId(this._userId, this._tokenInfo.roles[0].roleName).subscribe((resutWaiting: IDoctorWaiting) => {
          console.log("resutWaiting=>", resutWaiting);
          if (resultuser && resultuser != null) {
        this.ddashboardservice.getDashboardAptsByDoctId(this.today, this._userId, this._tokenInfo.roles[0].roleName).subscribe((result: IDoctorApptsAndCheckin) => {
          console.log("data=>1", result,this.today, this._userId);
          if (result && result != null) {

            this.Info = {
              patientswaiting: resutWaiting.waitingtokens ? resutWaiting.waitingtokens : 0,
              avgWaiting: resutWaiting.waitingTime ? (resutWaiting.waitingTime>0 ?resutWaiting.waitingTime : 0) : 0,
              totalAppts: result.totalAppts ? result.totalAppts : 0,
              totalCheckin: result.totalCheckin ? result.totalCheckin : 0,
              totalServed: resultuser.served ? resultuser.served : 0,
              totalServing: resultuser.serving ? resultuser.serving : 0
            } as IDashboardInfo;

            this.barChartData[0].data = [
              this.Info ? this.Info.totalAppts : 0,
              this.Info ? this.Info.totalCheckin : 0,
              this.Info ? this.Info.patientswaiting : 0,
              this.Info ? this.Info.totalServing : 0,
              this.Info ? this.Info.totalServed : 0
            ];
            console.log("Result=>", this.Info);
            console.log("Info=>", this.barChartData[0].data);
          } else {
            this.Info = {
              avgWaiting: 0,
              totalAppts: 0,
              totalCheckin: 0,
              totalServed: 0,
              totalServing: 0
            } as IDashboardInfo;
          }
          //this.refreshAction = true;
        },
          error => {
            this.Info = { avgWaiting: 0,totalAppts: 0,totalCheckin: 0,totalServed: 0,totalServing: 0
            } as IDashboardInfo;
            let message = error.error.messages as string;
            let errorMessage =
              error.status == 404
                ? this.translate.instant("ActionNames.errorResponse")
                : message
                  ? message
                  : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          }
        );
      } else {
        this.Info = {
          avgWaiting: 0,
          totalAppts: 0,
          totalCheckin: 0,
          totalServed: 0,
          totalServing: 0
        } as IDashboardInfo;
      }
    },
      error => {
        this.Info =  { avgWaiting: 0,totalAppts: 0,totalCheckin: 0,totalServed: 0,totalServing: 0
        } as IDashboardInfo;;
        let message = error.error.messages as string;
        let errorMessage =
          error.status == 404
            ? this.translate.instant("ActionNames.errorResponse")
            : message
              ? message
              : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      }
    );
      } else {
        this.Info = {
          avgWaiting: 0,
          totalAppts: 0,
          totalCheckin: 0,
          totalServed: 0,
          totalServing: 0
        } as IDashboardInfo;
      }
      this.refreshAction = true;
      this.loading=false;
    },
      error => {
        this.Info =  { avgWaiting: 0,totalAppts: 0,totalCheckin: 0,totalServed: 0,totalServing: 0
        } as IDashboardInfo;;
        let message = error.error.messages as string;
        let errorMessage =
          error.status == 404
            ? this.translate.instant("ActionNames.errorResponse")
            : message
              ? message
              : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.refreshAction = true;
        this.loading=false;
      }
    );
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401) this.router.navigate(["401"]);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
