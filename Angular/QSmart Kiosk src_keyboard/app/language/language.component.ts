import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { UserIdleService } from 'angular-user-idle';
import { AppConfig } from '../_helpers/app.config';
import { ISnackBarData } from './_model/language.model';
import { ErrorSnackBarComponent } from './alert/error';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  kioskid: any;
  interval: NodeJS.Timeout;
  Iskioskid: boolean = false;
  durationInSeconds: number = 0;

  constructor(private router: Router, private appconfig: AppConfig, private route: ActivatedRoute,
    private _snackBar: MatSnackBar, private dashboard: DashboardService, private translate: TranslateService, private userIdle: UserIdleService) {

    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    this.durationInSeconds = this.appconfig.getsnackbarDuration() ? this.appconfig.getsnackbarDuration() : 2;
    // if (this.appconfig.getKiosk()) {
    //   this.route.queryParams.subscribe(params => {
    //     if (params['kioskid']) {
    //       if (this.appconfig.getKiosk() != params['kioskid']) {
    //         console.log("kioskid updated");
    //         this.kioskid = params['kioskid'];
    //         this.appconfig.setKiosk(params['kioskid']);
    //         this.dashboard.defaultKioskid = params['kioskid'];
    //       } else {
    //         console.log("kioskid already exist");
    //         this.kioskid =this.appconfig.getKiosk();
    //         this.dashboard.defaultKioskid =this.appconfig.getKiosk();
    //       }
    //     } else {
    //       console.log("kioskid not in url so continue with existed kioskid");
    //       this.kioskid =this.appconfig.getKiosk();
    //       this.dashboard.defaultKioskid =this.appconfig.getKiosk();
    //     }
    //     console.log("Query param kioskid ::" + this.kioskid);
    //     //this.getMenuInfo();
    //   });
    // } else {
    //   console.log("kioskid is not exist .......");
    //   this.route.queryParams.subscribe(params => {
    //     this.kioskid = params['kioskid'];
    //     console.log("Query param kioskid ::" + this.kioskid);
    //     if (!this.kioskid) {
    //       console.log("DefaultKioskid from Service 2 : ", this.dashboard.defaultKioskid);
    //       this.kioskid = this.dashboard.defaultKioskid;
    //     }
    //    // this.getMenuInfo();
    //   });
    // }
    console.log('localStorage.getItem("kioskid")=>', localStorage.getItem("kioskid"));
    this.appconfig.setPHTransactionId(null)
    // if (localStorage.getItem("kioskid")) {
    this.route.queryParams.subscribe(params => {
      if (params['kioskid']) {
        if (this.appconfig.getKiosk() != (params['kioskid'] + '').trim()) {
          this.kioskid = params['kioskid'];
          localStorage.setItem('kioskid', params['kioskid']);
          // this.getMenusByGeneratedId();
          this.appconfig.setKiosk(this.kioskid);
          this.dashboard.defaultKioskid = this.kioskid;
          this.Iskioskid = true;
        }
        else {
          this.Iskioskid = true;
          console.log("kioskid already exist");
          this.kioskid = localStorage.getItem("kioskid");
          this.dashboard.defaultKioskid = this.kioskid;//this.appconfig.getKiosk();
        }
      } else {      
        this.Iskioskid = false;
        this.appconfig.setKiosk('');
        let messageData: ISnackBarData = {
          enMessage: this.translate.instant('LanguageModule.kioskNotFound-en'),
          arMessage: this.translate.instant('LanguageModule.kioskNotFound-ar')
        }
        this.openSnackBar(messageData);
      }

    });
    // } else {
    //   console.log("kioskid is not exist .......");
    //   this.route.queryParams.subscribe(params => {
    //     this.kioskid = params['kioskid'];
    //     console.log("Query param kioskid ::" + this.kioskid);
    //     if (!this.kioskid) {
    //       console.log("DefaultKioskid from Service 2 : ", this.dashboard.defaultKioskid);
    //       this.kioskid = this.dashboard.defaultKioskid;

    //       console.log("kioskid not in url so continue with existed kioskid");
    //       this.Iskioskid = false;
    //       this.appconfig.setKiosk('');
    //       let messageData: ISnackBarData = {
    //         enMessage: this.translate.instant('LanguageModule.kioskNotFound-en'),
    //         arMessage: this.translate.instant('LanguageModule.kioskNotFound-ar')
    //       }
    //       this.openSnackBar(messageData);
    //     }else{
    //       this.Iskioskid = true;
    //       this.kioskid = params['kioskid'];
    //       localStorage.setItem('kioskid', params['kioskid']);
    //       // this.getMenusByGeneratedId();
    //       this.appconfig.setKiosk(this.kioskid);
    //       this.dashboard.defaultKioskid = this.kioskid;
    //     }
    //   });
    // }
  }

  ngOnInit() {
  }

  selectLanguage(language) {
    if (language == 'english') {
      this.translate.addLangs(['en']);
      const engLang = this.translate.getBrowserLang();
      this.translate.use(engLang.match(/en|ar/) ? engLang : 'en');
    } else {
      this.translate.addLangs(['ar']);
      const fraLang = 'ar';
      this.translate.use(fraLang.match(/en|ar/) ? fraLang : 'ar');
    }
    console.log('before navigate=>', this.appconfig.getKiosk());

    this.router.navigate(['/', 'dashboard']);
  }//,{ queryParams:{kioskid:this.kioskid}}
  openSnackBar(data: ISnackBarData) {
    this._snackBar.dismiss();
    this._snackBar.openFromComponent(ErrorSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: data
    });
  }
  ngOnDestroy() {
    console.log("StartComponent Destroy..............");
    clearInterval(this.interval);
    this._snackBar.dismiss();
  }
}
