import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { UserIdleService } from 'angular-user-idle';
import { AppConfig } from '../../_helpers/app.config';
import { coreService } from '../_service/core.service';
import { IDateInfo, IPResponse } from '../_model/core.model';
import { Observable } from 'rxjs';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  subscriptionCurrentTime: any;
  private _router: Subscription;
  myTimeout;
  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  url: string;
  sidePanelOpened;
  options = {
    collapsed: false,
    compact: false,
    boxed: false,
    dark: false,
    dir: 'ltr'
  };

  @ViewChild('sidemenu') sidemenu;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  public config: PerfectScrollbarConfigInterface = {};
  currentDateTime: number;
  languageInfo: any;
  selectedLanguage: any;
  kioskid: any;

  constructor(public translate: TranslateService, private appconfig: AppConfig, private apiUrls: LoadApiUrls, private _element: ElementRef,
    public router: Router, zone: NgZone, private coreService: coreService, private userIdle: UserIdleService) {
    this.mediaMatcher.addListener(mql => zone.run(() => {
      //this.mediaMatcher = mql;
    }));
    this.appconfig.getKiosk()
    this.currentDateTime = Date.now();
    this.myTimeout = Observable.interval(1000).subscribe(data => {
      this.currentDateTime = this.currentDateTime + 1000;
    });
    this.getCurrentDate();
  }

  ngOnInit(): void {

    console.log("AdminLayoutComponent");

    this.url = this.router.url;

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
      this.url = event.url;
      this.runOnRouteChange();
    });

    if (this.router.url == "dashboard") {
      this.sidemenu.nativeElement.hide;
    }


  }
  getCurrentDate() {

    this.coreService.getCurrentDate().subscribe((response: IDateInfo) => {
      console.log("date response::", response)
      this.currentDateTime = new Date((response.dateTime).replace(/\s/g, "T")).getTime();
      console.log("currentDateTime::", this.currentDateTime);
    });
    // console.log('this.appconfig.getRecallCurrentDateAPIInterval()=>',this.appconfig.getRecallCurrentDateAPIInterval());

    this.subscriptionCurrentTime = Observable.interval(this.appconfig.getRecallCurrentDateAPIInterval() * 60000).subscribe(data => {
      this.coreService.getCurrentDate().subscribe((response: IDateInfo) => {
        if (response) {
          this.currentDateTime = new Date((response.dateTime).replace(/\s/g, "T")).getTime();
          console.log(" this.currentDateTime,date.now => ", this.currentDateTime, Date.now());
        }
      });
    });
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      // this.sidemenu.close(); // jagan
    }

    this.updatePS();
  }

  receiveOptions($event): void {
    this.options = $event;
  }

  onExitClick() {
    console.log("Exit event  :" + this.appconfig.getKiosk(), this.appconfig.getPHTransactionId());
    if (this.appconfig.getPHTransactionId()) {
      this.coreService.updatePharmaMasterStatusAndReason(this.appconfig.getPHTransactionId(), 0, 'Exited').subscribe((result: IPResponse) => {
        console.log("updatePharmaMasterStatusAndReason : Response", result)
      }

      );
    }
    this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return this.mediaMatcher.matches;
    }
  }

  menuMouseOver(): void {
    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'side';
    }
  }

  updatePS(): void {
    if (!this.mediaMatcher.matches && !this.options.compact) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, 350);
    }
  }
  ngOnDestroy(): void {
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    if (this._router)
      this._router.unsubscribe();
    if (this.subscriptionCurrentTime)
      this.subscriptionCurrentTime.unsubscribe();
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
  }
}
