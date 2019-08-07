import 'rxjs/add/operator/filter';

import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AppConfig } from '../../_helpers/app.config';
import { INotification, INotificationData } from '../notification/_model/notification';
import { Subscription } from 'rxjs/Subscription';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  config: any;
  private _router: Subscription;
  notificationData: INotificationData;
  notificationFlag: boolean = false;
  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  url: string;
  sidePanelOpened;
  loading: boolean = false;
  options = {
    collapsed: false,
    compact: false,
    boxed: false,
    dark: false,
    dir: 'ltr'
  };

  @ViewChild('sidemenu') sidemenu;
  @ViewChild('notifications') notifications;

  constructor(
    private router: Router,
    zone: NgZone, private cdrf: ChangeDetectorRef, private appConfig: AppConfig) {
      this.notificationData={status:false,Data:[]} as INotificationData;
    this.mediaMatcher.addListener(() => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
    }));

  }

  ngOnInit(): void {

    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
    this.url = this.router.url;

    this._router = this.router.events.filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        //console.log('this.router.events.filter AdminLayoutComponent => ', event);
        document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
        this.url = event.url;
        this.runOnRouteChange();
      });
  }
  getnotification(event: INotificationData) {
    this.notificationData = event;

    if (this.notificationFlag != event.status) {
      this.notificationFlag = event.status;
      this.notifications.toggle()
    }
  }
  ngOnDestroy(): void {
    if (<any>this._router)
      this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  receiveOptions($event): void {
    this.options = $event;
    this.cdrf.detectChanges();
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard' || this.url === '/profile' || this.url === '/about') {
      return true;
    }
    else {
      return this.mediaMatcher.matches;
    }
  }

  menuMouseOver(): void {
    console.log(' menuMouseOver =>');

    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    console.log(' menuMouseOut =>');
    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'side';
    }
  }

  updatePS(): void {
    // if (!this.mediaMatcher.matches && !this.options.compact) {
    //   setTimeout(() => {
    //     this.directiveScroll.update();
    //   }, 350);
    // }
  }
}
