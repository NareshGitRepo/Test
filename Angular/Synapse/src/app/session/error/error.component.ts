import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/_service/login.service';
import { AppConfig } from '../../_helpers/app.config';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private router:Router,private logservice:LoginService,private appconfig:AppConfig) { 
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }

  ngOnInit() {
  }
  click()
  {
    this.logservice.logout();
    localStorage.clear();
    this.appconfig.clearTokenInfo();
    this.router.navigate(['/']);
  }

}
