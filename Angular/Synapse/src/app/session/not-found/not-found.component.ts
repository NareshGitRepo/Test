import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../login/_service/login.service';
import { AppConfig } from '../../_helpers/app.config';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router:Router,private dailogue: MatDialog,private logservice:LoginService,private appconfig:AppConfig) {
 
   }

  ngOnInit() {
    this.dailogue.closeAll();
  }
  click()
  {
    this.logservice.logout();
    localStorage.clear();
    this.appconfig.clearTokenInfo();
    this.router.navigate(['/']);
  }

}
