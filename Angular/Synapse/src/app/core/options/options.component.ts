import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent {

  currentLang = 'en';
  showSettings = false;
  options = {
    collapsed: false,
    compact: false,
    boxed: false,
    dark: false,
    dir: 'ltr'
  };
  _tokenInfo: IUserUpdateDto;
  @Output() messageEvent = new EventEmitter<Object>();

  constructor(
    public translate: TranslateService, private appconfig: AppConfig, private cdrf: ChangeDetectorRef) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    // console.log("tokenInfo=>",this._tokenInfo.language);
    let browserLang: string = 'en';
    if (this._tokenInfo && tokenData)
      browserLang = this.appconfig.getMenuLoadStatus() ? translate.currentLang : this._tokenInfo.language && this._tokenInfo.language != null ? this._tokenInfo.language : translate.currentLang;//translate.getBrowserLang(); 
    this.currentLang = browserLang.match(/en|fr|ar/) ? browserLang : 'en';
    console.log("currentLang=>",this.currentLang);
    translate.use(this.currentLang);
  }
  ngOnInit() {
    if (this.currentLang == 'ar')
      this.options.dir = 'rtl';
    else
      this.options.dir = 'ltr';
    this.sendOptions();
  }
  sendOptions() {
    if (this.options.collapsed === true) {
      this.options.compact = false;
    }
    if (this.options.compact === true) {
      this.options.collapsed = false;
    }
    this.messageEvent.emit(this.options);
    this.cdrf.detectChanges();
  }
}
