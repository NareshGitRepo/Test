import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  kioskid = 0;
  constructor(translate: TranslateService, private router: Router) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
    // this.router.navigate(["/:kioskid"]);
    // this.router.navigate(["/"], { queryParams: { kioskid: 1 } });
  }
}
