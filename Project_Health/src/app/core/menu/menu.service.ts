import { Injectable } from '@angular/core';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { ConsumerService } from '../../_helpers/ConsumerService';
import { Observable } from 'rxjs';
import { MainMenu } from './menu.component';
import { HttpHeaders } from '@angular/common/http';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '/',
    name: 'HOME',
    type: 'link',
    icon: 'explore'
  },
  {
    state: 'http://primer.nyasha.me/docs',
    name: 'DOCS',
    type: 'extTabLink',
    icon: 'local_library'
  }
];

@Injectable()
export class MenuService {
  constructor(  private _ApiUrls: LoadApiUrls,private consumerService:ConsumerService) { }
  getUserRoleMenuInfoWithId():Observable<MainMenu[]> {
    //console.log("UserService:roleId:: ", roleId);
    const httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "text/plain",
        })
    };
    let _apiurlsdetials = this._ApiUrls.getApiServiceUrlByComponentAndMethod('Auth', "getMenuByRoleId")
    console.log("URL Get from config : =====>  ", _apiurlsdetials);
    if (_apiurlsdetials) {
      let _apiUrl = _apiurlsdetials.url;//.replace('{roleid}',roleId);
      console.log("URL Get from config : ---->  ", _apiUrl);
      return this.consumerService.serviceConsumerWithOptions<MainMenu[]>(_apiUrl, _apiurlsdetials.type, null, 'data',httpOptions);
    }
}

  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}
