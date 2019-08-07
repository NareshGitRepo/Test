import { Component, NgZone, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from './menu.service';

import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainMenu, ILoginDtos, AppConfig, ITokenInfo } from '../../_helpers/app.config';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MenuService]
})

export class MenuComponent implements OnInit, OnDestroy {
  private _router: Subscription;
  config: any;
  currentLang = 'en';
  activeTab: string = 'dashboard';
  activeSubTab: string = '';
  menuitems: MainMenu[];//=menuItems;
  _menuitemsLoad: MainMenu[] = [];
  //_rolename: string;
  _tokenInfo: ILoginDtos;



  constructor( public menuService: MenuService,
    public translate: TranslateService, private router: Router, private appconfig: AppConfig) {
    this.activeSubTab = this.router.url;
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenInfo;

    if (this._tokenInfo && tokenData) {
      try {
        if (this.appconfig.getMenuLoadItems() && this.appconfig.getMenuLoadStatus()) {
          this._menuitemsLoad = this.appconfig.getMenuLoadItems();
          let currenturl = this.router.url;
          let menuIndex = this._menuitemsLoad.findIndex(s => '/' + s.link == currenturl || s.submenu.findIndex(y => '/' + s.link + '/' + y.link == currenturl) != -1 || s.submenu.findIndex(y => '/' + y.link == currenturl) != -1);
          this.activeTab = menuIndex != -1 ? this._menuitemsLoad[menuIndex].link : '';
          this.menuitems = this._menuitemsLoad;
          // console.log('_activeTab=>', this._menuitemsLoad,currenturl,this.activeTab, this.appconfig.getMenuLoadItems(),menuIndex );
          console.log("_activeTab=>", this.activeTab);

        }
        else {
          menuService.getUserRoleMenuInfoWithId().subscribe((data: MainMenu[]) => {
            console.log("data=>123", data);

            this._menuitemsLoad = data;

            this.appconfig.setMenuLoadItems(this._menuitemsLoad);
            let currenturl = this.router.url;
            let menuIndex = this._menuitemsLoad.findIndex(s => '/' + s.link == currenturl || s.submenu.findIndex(y => '/' + s.link + '/' + y.link == currenturl) != -1 || s.submenu.findIndex(y => '/' + y.link == currenturl) != -1);
            console.log("_activeTab=>1", this.activeTab, menuIndex);
            if (menuIndex != -1 || currenturl == '/profile') {
              this.activeTab = menuIndex != -1 ? this._menuitemsLoad[menuIndex].link : '';
              this.menuitems = this._menuitemsLoad;
              console.log("_activeTab=>1", this.activeTab);

              if (!this.appconfig.getMenuLoadStatus()) {
                if (!this.appconfig.getRouteConfig()) {
                  this.appconfig.setRouteConfig(this.router.config[1].children);
                }
                let mainRouteConfig = this.router.config;
                let targetRouteConfig = this.appconfig.getRouteConfig();
                let redata = targetRouteConfig.filter(data => (data as any).path == 'profile' || (this.menuitems.findIndex(s => s.link == (data as any).path || s.submenu.findIndex(y => y.link == (data as any).path) != -1 || s.submenu.findIndex(y => (y.link).substring(0, y.link.indexOf('/')) == (data as any).path) != -1) != -1));
                console.log("redata=>", redata);

                mainRouteConfig[1].children = redata
                this.appconfig.setMenuLoadStatus(true);
                this.router.resetConfig(mainRouteConfig);
              }
            }
            else
              this.router.navigate(['**']);
          }, error => {
            console.log("Failed :: menu loaded " + JSON.stringify(error));
            this.router.navigate(['**']);
          });
        }
      } catch (e) {
        console.log('error=>', e);
        this.router.navigate(['**']);
      }
    }
    else
      this.router.navigate(['401']);
  }
  ngOnInit(): void {
    // console.log('this.router.events.filter AdminLayoutComponent =>1 ');
    this._router = this.router.events.filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {

        if (this.activeSubTab != event.url) {
          if (this._menuitemsLoad) {
            this.activeSubTab = event.url;
            let menuIndex = this._menuitemsLoad.findIndex(s => '/' + s.link == this.activeSubTab || s.submenu.findIndex(y => '/' + s.link + '/' + y.link == this.activeSubTab) != -1 || s.submenu.findIndex(y => '/' + y.link == this.activeSubTab) != -1);
            this.activeTab = menuIndex != -1 ? this._menuitemsLoad[menuIndex].link : '';
            // console.log('this.router.events.filter AdminLayoutComponent =>1 ', event, this.activeSubTab, this.activeTab, this._menuitemsLoad);
          }
        }

      });
  }
  ngOnDestroy(): void {
    if (<any>this._router)
      this._router.unsubscribe();
  }
  handleClick(menuitem, action: boolean) {
    let currenturl = this.router.url;
    this.activeSubTab = '/' + menuitem.link;
    if (action)
      this.activeTab = menuitem.link;
    console.log('handleClick =>', menuitem.link, this.activeTab, this.activeSubTab, this.router.url);
    if ('/' + menuitem.link == currenturl) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/' + menuitem.link]));
    }
    else {

      this.router.navigate(['/' + menuitem.link]);
    }
  }

}
