import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AppConfig } from '../../_helpers/app.config';
import { LoginService } from '../../login/_service/login.service';

@Component({
  selector: 'app-unerror',
  template:  `<div class="session">
  <div class="session-content text-xs-center">
    <div>
      <div class="error-subtitle">Your Session has Expired...!</div>
      <p class="mat-text-muted"> <a (click)="click()">Click login here</a></p>
    </div>
  </div>
</div>
`,
  styleUrls: ['./error.component.scss']
})
export class UnErrorComponent implements OnInit {
// <div class="error-title">401</div>
  constructor(private router:Router,private dialog:MatDialog,private appconfig:AppConfig,private logservice:LoginService) { 
    history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }

  ngOnInit() {
    this.dialog.closeAll();
    this.logservice.logout();
    localStorage.clear();
    this.appconfig.clearTokenInfo();
  }
  click()
  {
 
   
    this.router.navigate(['/']);
  }

}
