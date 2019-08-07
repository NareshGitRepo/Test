import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import { TranslateService } from '@ngx-translate/core';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { EncriptAndDecriptService } from '../../_helpers/encriptAndDecript';

// import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  private _router: Subscription;
  config: any;

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
  _tokenInfo: IUserUpdateDto;
  currentLang = 'en';
  @ViewChild('sidemenu') sidemenu;

  // @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  // public config: PerfectScrollbarConfigInterface = {};

  constructor(private cdRef: ChangeDetectorRef, public translate: TranslateService, private appconfig: AppConfig,
    private _element: ElementRef,
    private router: Router,private encriptAndDecriptService: EncriptAndDecriptService,
    zone: NgZone) {
    this.mediaMatcher.addListener(() => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
    }));
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    // console.log("tokenInfo=>",this._tokenInfo.language);
    let browserLang: string = 'en';
    if (this._tokenInfo && tokenData)
    {
      if(localStorage.getItem('lang') ==null)
      browserLang = this.appconfig.getMenuLoadStatus() ? translate.currentLang : this._tokenInfo.language && this._tokenInfo.language != null ? this._tokenInfo.language : translate.currentLang;//translate.getBrowserLang(); 
      else{
       let decript= this.encriptAndDecriptService.decryptData(localStorage.getItem('lang'));
       browserLang=(decript=='en' || decript=='ar') ? decript :'en';
      }
    }
    this.currentLang = browserLang.match(/en|fr|ar/) ? browserLang : 'en';
    console.log("currentLang=>",this.currentLang);
    translate.use(this.currentLang);
  }

  ngOnInit(): void {
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
    this.url = this.router.url;

    this._router = this.router.events.filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        console.log('this.router.events.filter AdminLayoutComponent => ', event);

        document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
        this.url = event.url;
        this.runOnRouteChange();
      });
    this.cdRef.detectChanges();
    
  this.sendOptions();
}
sendOptions() {
  if (this.currentLang == 'ar')
    this.options.dir = 'rtl';
  else
    this.options.dir = 'ltr';
  if (this.options.collapsed === true) {
    this.options.compact = false;
  }
  if (this.options.compact === true) {
    this.options.collapsed = false;
  }
  this.cdRef.detectChanges();
}

  ngOnDestroy(): void {
    if(this._router)
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  receiveLangchange($event): void {
    //this.options = $event;
    console.log("currentLang=>",$event);
    let encript = this.encriptAndDecriptService.encryptData($event);
    localStorage.setItem('lang', encript);
    this.currentLang=$event;
    this.translate.use(this.currentLang);
    this.sendOptions();
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard' || this.url === '/profile') {
      return true;
    } else {
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
