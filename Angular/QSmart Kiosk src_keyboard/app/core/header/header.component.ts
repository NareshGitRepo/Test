import { Component, EventEmitter, Output, LOCALE_ID, Inject } from '@angular/core';
import * as screenfull from 'screenfull';
import { LoadApiUrls } from '../../_helpers/api.urls';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  English: boolean = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleNotificationSidenav = new EventEmitter<void>();

  currentDateTime: number;
  //languageInfo: any;
  selectedLanguage: any;

  constructor(private translate: TranslateService, private apiUrls: LoadApiUrls,
    @Inject(LOCALE_ID) public readonly localeId, public router: Router) {
      
    // setInterval(() => {
    //   this.currentDateTime = Date.now();
    // }, 1);

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

  }

  ngOnInit() {
    //this.languageInfo = this.apiUrls.getlanguageInfo();
    //console.log("Info :: " + JSON.stringify(this.languageInfo));
  }


  fullScreenToggle(): void {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }

  selectLanguage(selLanguage: string) {
    if (selLanguage == 'english') {
      this.English = false;
      this.translate.addLangs(['en']);
      const engLang = this.translate.getBrowserLang();
      this.translate.use(engLang.match(/en|ar/) ? engLang : 'en');
    } else {
      this.English = true;
      this.translate.addLangs(['ar']);
      const fraLang = 'ar';
      this.translate.use(fraLang.match(/en|ar/) ? fraLang : 'ar');
    }
  }

}
