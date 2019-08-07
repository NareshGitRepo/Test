import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/_service/login.service';
import { AppConfig } from '../../_helpers/app.config';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router:Router,private logservice:LoginService,private appconfig:AppConfig) {
 
   }

  ngOnInit() {
  }
  click()
  {
    this.logservice.logout();
    localStorage.clear();
    this.appconfig.clearTokenInfo();
    if(this.appconfig.getHeaderLoads())
    this.router.navigate(['/']);
    else
    this.router.navigate(['/'], { queryParams: { hl: 0 } });
   // this.router.navigate(['/']);
  }

}
